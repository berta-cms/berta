import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector, Store } from '@ngxs/store';
import { EMPTY } from 'rxjs';
import { catchError, concatMap, finalize, tap } from 'rxjs/operators';

import { AppState } from '../app-state/app.state';
import { UpdateAppStateAction } from '../app-state/app.actions';
import { UserLoginAction } from '../user/user.actions';
import { AiAssistantService, AiChange } from './ai-assistant.service';
import { AiChangesMirrorService } from './ai-changes-mirror.service';
import {
  ToggleAiAssistantAction,
  SendAiMessageAction,
  AiReplyReceivedAction,
  UndoAiMessageAction,
  ClearAiChatAction,
  SubmitAiFeedbackAction,
  FetchAiQuotaAction,
  AiQuotaFetchedAction,
} from './ai-assistant.actions';

export interface AiMessage {
  role: 'user' | 'assistant';
  content: string;
  vote?: 'up' | 'down';
  /** The changes an assistant reply made on the server, which its Undo button undoes. */
  changes?: AiChange[];
  /** Whether those changes were undone. */
  undone?: boolean;
  /** Why they couldn't be undone, e.g. because they were changed since. */
  undoRefusal?: string;
}

export interface AiAssistantStateModel {
  isOpen: boolean;
  messages: AiMessage[];
  isLoading: boolean;
  /** The index of the message whose changes are being undone. */
  undoingIndex: number | null;
  loadedSite: string | null;
  dailyLimitMessage: string | null;
  dailyUsage: { count: number; limit: number } | null;
  pendingInput: string | null;
}

const STORAGE_KEY_PREFIX = 'berta_ai_chat_';

const defaults: AiAssistantStateModel = {
  isOpen: false,
  messages: [],
  isLoading: false,
  undoingIndex: null,
  loadedSite: null,
  dailyLimitMessage: null,
  dailyUsage: null,
  pendingInput: null,
};

/**
 * The editor's AI chat. The server's agent reads and changes the site with the same tools AI apps use over MCP;
 * each reply comes with the changes it made and the fresh data of what they touched, which AiChangesMirrorService
 * shows in the editor and the preview. A reply's changes are undone on the server, without the AI. Each site's
 * conversation is kept in the browser.
 */
@State<AiAssistantStateModel>({
  name: 'aiAssistant',
  defaults,
})
@Injectable()
export class AiAssistantState {
  @Selector()
  static isOpen(state: AiAssistantStateModel) {
    return state.isOpen;
  }

  @Selector()
  static messages(state: AiAssistantStateModel) {
    return state.messages;
  }

  @Selector()
  static isLoading(state: AiAssistantStateModel) {
    return state.isLoading;
  }

  @Selector()
  static undoingIndex(state: AiAssistantStateModel) {
    return state.undoingIndex;
  }

  @Selector()
  static dailyLimitMessage(state: AiAssistantStateModel) {
    return state.dailyLimitMessage;
  }

  @Selector()
  static pendingInput(state: AiAssistantStateModel) {
    return state.pendingInput;
  }

  @Selector()
  static dailyUsage(state: AiAssistantStateModel) {
    return state.dailyUsage;
  }

  constructor(
    private store: Store,
    private aiAssistantService: AiAssistantService,
    private changesMirror: AiChangesMirrorService,
  ) {}

  @Action(UpdateAppStateAction)
  onAppStateUpdate(
    { patchState, getState }: StateContext<AiAssistantStateModel>,
    action: UpdateAppStateAction,
  ) {
    const site = action.payload?.site;
    if (site == null || getState().loadedSite === site) {
      return;
    }

    patchState({ messages: this.loadMessages(site), loadedSite: site });
  }

  @Action(UserLoginAction)
  onLogin({ setState }: StateContext<AiAssistantStateModel>) {
    try {
      Object.keys(localStorage)
        .filter((key) => key.startsWith(STORAGE_KEY_PREFIX))
        .forEach((key) => localStorage.removeItem(key));
    } catch {}
    setState(defaults);
  }

  @Action(ToggleAiAssistantAction)
  toggle({
    patchState,
    getState,
    dispatch,
  }: StateContext<AiAssistantStateModel>) {
    const willOpen = !getState().isOpen;
    patchState({ isOpen: willOpen });
    if (willOpen) {
      dispatch(new FetchAiQuotaAction());
    }
  }

  @Action(FetchAiQuotaAction)
  fetchQuota({ dispatch }: StateContext<AiAssistantStateModel>) {
    return this.aiAssistantService.getQuota().pipe(
      tap((usage) => dispatch(new AiQuotaFetchedAction(usage))),
      catchError(() => EMPTY),
    );
  }

  @Action(AiQuotaFetchedAction)
  quotaFetched(
    { patchState }: StateContext<AiAssistantStateModel>,
    action: AiQuotaFetchedAction,
  ) {
    patchState({ dailyUsage: action.usage });
  }

  @Action(SendAiMessageAction)
  sendMessage(
    { patchState, getState, dispatch }: StateContext<AiAssistantStateModel>,
    action: SendAiMessageAction,
  ) {
    const history = getState().messages.map(({ role, content }) => ({
      role,
      content,
    }));
    patchState({
      messages: [
        ...getState().messages,
        { role: 'user', content: action.message },
      ],
      isLoading: true,
      pendingInput: null,
    });

    return this.aiAssistantService
      .chat(action.message, history, this.site())
      .pipe(
        tap((response) => {
          if (response.daily_usage) {
            patchState({ dailyUsage: response.daily_usage });
          }
        }),
        concatMap((response) =>
          this.changesMirror
            .mirror(response.changes ?? [], response.refresh)
            .pipe(
              finalize(() =>
                dispatch(
                  new AiReplyReceivedAction(
                    response.reply,
                    response.changes ?? [],
                  ),
                ),
              ),
            ),
        ),
        catchError((error) => {
          console.error('AI assistant error:', error);
          if (error?.status === 429) {
            const messages = getState().messages;
            patchState({
              isLoading: false,
              dailyLimitMessage:
                error?.error?.message ?? 'Daily limit reached.',
              messages: messages.slice(0, -1),
              pendingInput: action.message,
            });
            setTimeout(() => patchState({ dailyLimitMessage: null }), 10000);
          } else {
            patchState({ isLoading: false });
          }
          return EMPTY;
        }),
      );
  }

  @Action(AiReplyReceivedAction)
  replyReceived(
    { patchState, getState }: StateContext<AiAssistantStateModel>,
    action: AiReplyReceivedAction,
  ) {
    const messages: AiMessage[] = [
      ...getState().messages,
      {
        role: 'assistant',
        content: action.reply,
        ...(action.changes.length ? { changes: action.changes } : {}),
      },
    ];
    patchState({ messages, isLoading: false });
    this.saveMessages(messages);
  }

  @Action(UndoAiMessageAction)
  undoMessage(
    { patchState, getState }: StateContext<AiAssistantStateModel>,
    action: UndoAiMessageAction,
  ) {
    const message = getState().messages[action.messageIndex];

    if (
      !message?.changes?.length ||
      message.undone ||
      getState().undoingIndex !== null
    ) {
      return EMPTY;
    }

    patchState({ undoingIndex: action.messageIndex });

    return this.aiAssistantService
      .undo(message.changes.map((change) => change.change_id))
      .pipe(
        concatMap((response) =>
          this.changesMirror
            .mirror(response.changes ?? [], response.refresh)
            .pipe(
              finalize(() => {
                const undone =
                  response.undone.length === message.changes.length;
                const messages = getState().messages.map((m, index) =>
                  index !== action.messageIndex
                    ? m
                    : {
                        ...m,
                        undone,
                        undoRefusal: response.refusal ?? undefined,
                        // Changes undone before a refusal stay undone: only the rest can be undone again.
                        changes: (m.changes ?? []).filter(
                          (change) =>
                            !response.undone.includes(change.change_id),
                        ),
                      },
                );
                patchState({ messages, undoingIndex: null });
                this.saveMessages(messages);
              }),
            ),
        ),
        catchError((error) => {
          console.error('AI assistant undo error:', error);
          patchState({ undoingIndex: null });
          return EMPTY;
        }),
      );
  }

  @Action(SubmitAiFeedbackAction)
  submitFeedback(
    { getState, patchState }: StateContext<AiAssistantStateModel>,
    action: SubmitAiFeedbackAction,
  ) {
    const messages = getState().messages;
    const assistantMessage = messages[action.messageIndex];

    if (!assistantMessage || assistantMessage.role !== 'assistant') {
      return EMPTY;
    }

    const userMessage = [...messages.slice(0, action.messageIndex)]
      .reverse()
      .find((m) => m.role === 'user');
    const updatedMessages = messages.map((m, i) =>
      i === action.messageIndex ? { ...m, vote: action.vote } : m,
    );
    patchState({ messages: updatedMessages });
    this.saveMessages(updatedMessages);

    return this.aiAssistantService
      .feedback(
        action.vote,
        userMessage?.content ?? '',
        assistantMessage.content,
        messages.map((m) => ({ role: m.role, content: m.content })),
      )
      .pipe(
        catchError((error) => {
          console.error('AI feedback error:', error);
          return EMPTY;
        }),
      );
  }

  @Action(ClearAiChatAction)
  clearChat({ patchState }: StateContext<AiAssistantStateModel>) {
    try {
      localStorage.removeItem(STORAGE_KEY_PREFIX + this.site());
    } catch {}
    patchState({
      messages: [],
      isLoading: false,
      undoingIndex: null,
      dailyLimitMessage: null,
      pendingInput: null,
    });
  }

  private site(): string {
    return this.store.selectSnapshot(AppState.getSite) || '';
  }

  private loadMessages(site: string): AiMessage[] {
    try {
      const stored = JSON.parse(
        localStorage.getItem(STORAGE_KEY_PREFIX + site) ?? 'null',
      );
      return Array.isArray(stored?.messages) ? stored.messages : [];
    } catch {
      return [];
    }
  }

  private saveMessages(messages: AiMessage[]) {
    try {
      localStorage.setItem(
        STORAGE_KEY_PREFIX + this.site(),
        JSON.stringify({ messages }),
      );
    } catch {}
  }
}
