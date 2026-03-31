import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { tap, catchError, concatMap } from 'rxjs/operators';
import { EMPTY, from, concat } from 'rxjs';

import { Store } from '@ngxs/store';
import { AppState } from '../app-state/app.state';
import { SiteSettingsState } from '../sites/settings/site-settings.state';
import { SiteSectionsState } from '../sites/sections/sections-state/site-sections.state';
import { UpdateSiteTemplateSettingsAction } from '../sites/template-settings/site-template-settings.actions';
import { UpdateSiteSettingsAction } from '../sites/settings/site-settings.actions';
import {
  CreateSectionAction,
  UpdateSiteSectionAction,
  RenameSiteSectionAction,
  DeleteSiteSectionAction,
  ReOrderSiteSectionsAction,
} from '../sites/sections/sections-state/site-sections.actions';
import { AiAssistantService, AiSectionChangeItem as AiSectionChangeResponseItem } from './ai-assistant.service';
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

export interface AiChangeItem {
  group: string;
  setting: string;
  value: string;
  previousValue: string | null;
}

export interface AiSectionChangeItem {
  operation: string;
  name?: string;
  title?: string;
  property?: string;
  value?: string;
  previousValue?: string | null;
  order?: number;
}

export interface AiChangeHistoryItem {
  userMessage: string;
  designChanges: AiChangeItem[];
  settingsChanges: AiChangeItem[];
  sectionChanges: AiSectionChangeItem[];
}

export interface AiAssistantStateModel {
  isOpen: boolean;
  messages: AiMessage[];
  isLoading: boolean;
  changeHistory: AiChangeHistoryItem[];
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
      section_changes: entry.sectionChanges.map((c) => ({
        operation: c.operation as AiSectionChangeResponseItem['operation'],
        name: c.name,
        title: c.title,
        property: c.property,
        value: c.value,
        previous_value: c.previousValue,
        order: c.order,
      })),
    }));

    return this.aiAssistantService
      .chat(action.message, history, site, template, changeHistoryPayload)
      .pipe(
        tap((response) => {
          dispatch(
            new AiMessageReceivedAction(response.reply, response.design_changes, response.settings_changes, response.section_changes ?? [], response.is_undo),
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

    const site = this.store.selectSnapshot(AppState.getSite) || '';
    const currentSections = this.store.selectSnapshot(SiteSectionsState.getCurrentSiteSections);

    let changeHistory: AiChangeHistoryItem[];
    if (action.isUndo) {
      changeHistory = state.changeHistory.slice(0, -1);
    } else {
      const lastUserMessage = [...state.messages].reverse().find((m) => m.role === 'user');
      const newItem: AiChangeHistoryItem = {
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
        sectionChanges: action.sectionChanges.map((c) => {
          if (c.operation === 'reorder') {
            // Capture previousValue from frontend state (reliable) before the reorder dispatch
            const section = currentSections.find((s) => s.name === c.name);
            return {
              operation: c.operation,
              name: c.name,
              previousValue: section != null ? String(section.order) : (c.previous_value ?? null),
              order: c.order,
            };
          }
          return {
            operation: c.operation,
            name: c.name,
            title: c.title,
            property: c.property,
            value: c.value,
            previousValue: c.previous_value ?? null,
            order: c.order,
          };
        }),
      };
      const hasChanges =
        newItem.designChanges.length > 0 ||
        newItem.settingsChanges.length > 0 ||
        newItem.sectionChanges.length > 0;
      changeHistory = hasChanges ? [...state.changeHistory, newItem] : state.changeHistory;
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

    const lastHistoryItem = action.isUndo
      ? state.changeHistory[state.changeHistory.length - 1]
      : null;

    const createChanges = action.sectionChanges.filter((c) => c.operation === 'create');
    const cloneChanges = action.sectionChanges.filter((c) => c.operation === 'clone');
    const reorderChanges = action.sectionChanges.filter((c) => c.operation === 'reorder');

    for (const change of action.sectionChanges) {
      const { operation, name, property, value } = change;

      if (operation === 'create') {
        // handled in createChain below
      } else if (operation === 'update') {
        let section = currentSections.find((s) => s.name === name);

        // Fallback for rename: after rename the section slug changes, so the old
        // name no longer matches. Search change history for a prior rename of this
        // name and find the section by its current title instead.
        if (!section && property === 'title') {
          for (let i = state.changeHistory.length - 1; i >= 0; i--) {
            const histChange = state.changeHistory[i].sectionChanges.find(
              (c) => c.operation === 'update' && c.property === 'title' && c.name === name,
            );
            if (histChange?.value) {
              section = currentSections.find((s) => s.title === histChange.value);
              if (section) break;
            }
          }
        }

        if (section && property) {
          if (property === 'title') {
            dispatch(new RenameSiteSectionAction(section, section.order, { title: value ?? '' }));
          } else if (property === 'published') {
            // Normalize to '0'/'1': AI may return 'yes'/'no' due to ambiguous prompt instructions
            const publishedValue = (value === '1' || value === 'yes' || value === 'true') ? '1' : '0';
            dispatch(new UpdateSiteSectionAction(site, section.order, { '@attributes': { published: publishedValue } }));
          } else if (property === 'type') {
            dispatch(new UpdateSiteSectionAction(site, section.order, { '@attributes': { [property]: value ?? '' } }));
          } else {
            dispatch(new UpdateSiteSectionAction(site, section.order, { [property]: value ?? '' }));
          }
        }
      } else if (operation === 'delete') {
        let section = currentSections.find((s) => s.name === name);

        // Fallback: on undo of a create, the server assigns its own slug (e.g. untitled-1).
        // After creation we store that server-assigned name in c.value. Try by value first,
        // then fall back to matching by title.
        if (!section && action.isUndo && lastHistoryItem) {
          const histChange = lastHistoryItem.sectionChanges.find(
            (c) => c.operation === 'create' && (c.name === name || c.value === name),
          );
          if (histChange?.value) {
            section = currentSections.find((s) => s.name === histChange.value);
          }
          if (!section && histChange?.title) {
            section = currentSections.find((s) => s.title === histChange.title);
          }
        }

        // Fallback: on undo of a clone, find the cloned section by the name stored in history
        if (!section && action.isUndo && lastHistoryItem) {
          const cloneHistChange = lastHistoryItem.sectionChanges.find(
            (c) => c.operation === 'clone' && (c.name === name || c.value === name),
          );
          if (cloneHistChange?.value) {
            section = currentSections.find((s) => s.name === cloneHistChange.value);
          }
        }

        if (section) {
          dispatch(new DeleteSiteSectionAction(section));
        }
      }
    }

    // Create dispatches — sequential, capturing the server-assigned name for undo support
    const createChain = from(createChanges).pipe(
      concatMap((change) => {
        const sectionsBefore = this.store.selectSnapshot(SiteSectionsState.getCurrentSiteSections);
        return dispatch(new CreateSectionAction({ name: null, title: change.title ?? change.name } as any)).pipe(
          tap(() => {
            if (!action.isUndo) {
              const sectionsAfter = this.store.selectSnapshot(SiteSectionsState.getCurrentSiteSections);
              const newSection = sectionsAfter.find((s) => !sectionsBefore.some((b) => b.name === s.name));
              if (newSection) {
                const currentHistory = getState().changeHistory;
                patchState({
                  changeHistory: currentHistory.map((entry, idx) => {
                    if (idx !== currentHistory.length - 1) return entry;
                    return {
                      ...entry,
                      sectionChanges: entry.sectionChanges.map((c) =>
                        c.operation === 'create' && c.name === change.name
                          ? { ...c, value: newSection.name }
                          : c,
                      ),
                    };
                  }),
                });
              }
            }
          }),
        );
      }),
    );

    // Clone dispatches — sequential, capturing the server-assigned name for undo support.
    // Dispatch CreateSectionAction directly (not CloneSectionAction) because CloneSectionAction
    // doesn't return the inner Observable, causing dispatch() to complete before the HTTP call
    // finishes and making the tap() snapshot miss the newly created section.
    const cloneChain = from(cloneChanges).pipe(
      concatMap((change) => {
        const sectionsBefore = this.store.selectSnapshot(SiteSectionsState.getCurrentSiteSections);
        const sourceSection = sectionsBefore.find((s) => s.name === change.name);
        if (!sourceSection) return EMPTY;

        return dispatch(new CreateSectionAction(sourceSection)).pipe(
          tap(() => {
            if (!action.isUndo) {
              // Detect the newly created section and store its name in history for undo
              const sectionsAfter = this.store.selectSnapshot(SiteSectionsState.getCurrentSiteSections);
              const newSection = sectionsAfter.find((s) => !sectionsBefore.some((b) => b.name === s.name));
              if (newSection) {
                const currentHistory = getState().changeHistory;
                patchState({
                  changeHistory: currentHistory.map((entry, idx) => {
                    if (idx !== currentHistory.length - 1) return entry;
                    return {
                      ...entry,
                      sectionChanges: entry.sectionChanges.map((c) =>
                        c.operation === 'clone' && c.name === change.name
                          ? { ...c, value: newSection.name }
                          : c,
                      ),
                    };
                  }),
                });
              }
            }
          }),
        );
      }),
    );

    const reorderChain = from(reorderChanges).pipe(
      concatMap((change) => {
        // Snapshot live state at THIS moment so we see updates from prior reorders
        const liveSection = this.store
          .selectSnapshot(SiteSectionsState.getCurrentSiteSections)
          .find((s) => s.name === change.name);

        if (!liveSection) return EMPTY;

        let targetOrder: number | undefined = change.order;
        if (action.isUndo && lastHistoryItem) {
          const histChange = lastHistoryItem.sectionChanges.find(
            (c) => c.operation === 'reorder' && c.name === change.name,
          );
          if (histChange?.previousValue != null) {
            targetOrder = parseInt(histChange.previousValue, 10);
          }
        }

        if (targetOrder === undefined) return EMPTY;

        return dispatch(new ReOrderSiteSectionsAction(liveSection.order, targetOrder));
      }),
    );

    return concat(createChain, cloneChain, reorderChain);
  }

  @Action(ClearAiChatAction)
  clearChat({ setState }: StateContext<AiAssistantStateModel>) {
    setState(defaults);
  }
}
