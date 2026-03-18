import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { tap, catchError } from 'rxjs/operators';
import { EMPTY } from 'rxjs';

import { Store } from '@ngxs/store';
import { AppState } from '../app-state/app.state';
import { SiteSettingsState } from '../sites/settings/site-settings.state';
import { UpdateSiteTemplateSettingsAction } from '../sites/template-settings/site-template-settings.actions';
import { UpdateSiteSettingsAction } from '../sites/settings/site-settings.actions';
import { AiAssistantService } from './ai-assistant.service';
import {
  ToggleAiAssistantAction,
  SendAiMessageAction,
  AiMessageReceivedAction,
  ClearAiChatAction,
} from './ai-assistant.actions';

export interface AiMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AiChangeEntry {
  group: string;
  setting: string;
  value: string;
  previousValue: string | null;
}

export interface AiChangeHistoryEntry {
  userMessage: string;
  designChanges: AiChangeEntry[];
  settingsChanges: AiChangeEntry[];
}

export interface AiAssistantStateModel {
  isOpen: boolean;
  messages: AiMessage[];
  isLoading: boolean;
  changeHistory: AiChangeHistoryEntry[];
}

const defaults: AiAssistantStateModel = {
  isOpen: false,
  messages: [],
  isLoading: false,
  changeHistory: [],
};

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

  constructor(
    private store: Store,
    private aiAssistantService: AiAssistantService,
  ) {}

  @Action(ToggleAiAssistantAction)
  toggle({ patchState, getState }: StateContext<AiAssistantStateModel>) {
    patchState({ isOpen: !getState().isOpen });
  }

  @Action(SendAiMessageAction)
  sendMessage(
    { patchState, getState, dispatch }: StateContext<AiAssistantStateModel>,
    action: SendAiMessageAction,
  ) {
    const state = getState();
    const userMessage: AiMessage = { role: 'user', content: action.message };
    patchState({
      messages: [...state.messages, userMessage],
      isLoading: true,
    });

    const site = this.store.selectSnapshot(AppState.getSite) || '';
    const template =
      this.store.selectSnapshot(SiteSettingsState.getCurrentSiteTemplate) ||
      '';
    const history = state.messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    const changeHistoryPayload = state.changeHistory.map((entry) => ({
      user_message: entry.userMessage,
      design_changes: entry.designChanges.map((c) => ({
        group: c.group,
        setting: c.setting,
        value: c.value,
        previous_value: c.previousValue,
      })),
      settings_changes: entry.settingsChanges.map((c) => ({
        group: c.group,
        setting: c.setting,
        value: c.value,
        previous_value: c.previousValue,
      })),
    }));

    return this.aiAssistantService
      .chat(action.message, history, site, template, changeHistoryPayload)
      .pipe(
        tap((response) => {
          dispatch(
            new AiMessageReceivedAction(response.reply, response.design_changes, response.settings_changes, response.is_undo),
          );
        }),
        catchError((error) => {
          console.error('AI assistant error:', error);
          patchState({ isLoading: false });
          return EMPTY;
        }),
      );
  }

  @Action(AiMessageReceivedAction)
  messageReceived(
    { patchState, getState, dispatch }: StateContext<AiAssistantStateModel>,
    action: AiMessageReceivedAction,
  ) {
    const state = getState();
    const assistantMessage: AiMessage = {
      role: 'assistant',
      content: action.reply,
    };

    let changeHistory: AiChangeHistoryEntry[];
    if (action.isUndo) {
      changeHistory = state.changeHistory.slice(0, -1);
    } else {
      const lastUserMessage = [...state.messages].reverse().find((m) => m.role === 'user');
      const newEntry: AiChangeHistoryEntry = {
        userMessage: lastUserMessage?.content ?? '',
        designChanges: action.designChanges.map((c) => ({
          group: c.group,
          setting: c.setting,
          value: c.value,
          previousValue: c.previous_value ?? null,
        })),
        settingsChanges: action.settingsChanges.map((c) => ({
          group: c.group,
          setting: c.setting,
          value: c.value,
          previousValue: c.previous_value ?? null,
        })),
      };
      changeHistory = [...state.changeHistory, newEntry];
    }

    patchState({
      messages: [...state.messages, assistantMessage],
      isLoading: false,
      changeHistory,
    });

    for (const change of action.designChanges) {
      dispatch(
        new UpdateSiteTemplateSettingsAction(change.group, {
          [change.setting]: change.value,
        }),
      );
    }

    for (const change of action.settingsChanges) {
      dispatch(
        new UpdateSiteSettingsAction(change.group, {
          [change.setting]: change.value,
        }),
      );
    }
  }

  @Action(ClearAiChatAction)
  clearChat({ setState }: StateContext<AiAssistantStateModel>) {
    setState(defaults);
  }
}
