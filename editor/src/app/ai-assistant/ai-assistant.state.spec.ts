import { StateContext, Store } from '@ngxs/store';
import { of, throwError } from 'rxjs';

import { AppState } from '../app-state/app.state';
import {
  AiReplyReceivedAction,
  SendAiMessageAction,
  UndoAiMessageAction,
} from './ai-assistant.actions';
import { AiAssistantService, AiChange } from './ai-assistant.service';
import { AiAssistantState, AiAssistantStateModel } from './ai-assistant.state';
import { AiChangesMirrorService } from './ai-changes-mirror.service';

describe('AiAssistantState', () => {
  const CHANGE: AiChange = {
    change_id: '7',
    tool: 'create-section',
    subsite: '',
    kind: 'section',
    action: 'create',
    items: [],
  };
  const REFRESH = { site_data: { '': { sections: [] } } };

  let model: AiAssistantStateModel;
  let context: StateContext<AiAssistantStateModel>;
  let service: jasmine.SpyObj<AiAssistantService>;
  let mirror: jasmine.Spy;
  let state: AiAssistantState;

  beforeEach(() => {
    localStorage.clear();
    model = {
      isOpen: true,
      messages: [],
      isLoading: false,
      undoingIndex: null,
      loadedSite: '',
      dailyLimitMessage: null,
      dailyUsage: null,
      pendingInput: null,
    };
    service = jasmine.createSpyObj('AiAssistantService', ['chat', 'undo']);
    mirror = jasmine.createSpy('mirror').and.returnValue(of(null));
    state = new AiAssistantState(
      {
        selectSnapshot: (selector: unknown) =>
          selector === AppState.getSite ? '' : undefined,
      } as unknown as Store,
      service,
      { mirror } as unknown as AiChangesMirrorService,
    );
    context = {
      getState: () => model,
      patchState: (patch: Partial<AiAssistantStateModel>) => {
        model = { ...model, ...patch };
        return model;
      },
      dispatch: (action: unknown) => {
        if (action instanceof AiReplyReceivedAction) {
          state.replyReceived(context, action);
        }
        return of(null);
      },
    } as unknown as StateContext<AiAssistantStateModel>;
  });

  it('sends the message with the conversation, and adds the reply with the changes it made', () => {
    model.messages = [{ role: 'assistant', content: 'Hi', changes: [CHANGE] }];
    service.chat.and.returnValue(
      of({ reply: 'Added.', changes: [CHANGE], refresh: REFRESH }),
    );

    state
      .sendMessage(context, new SendAiMessageAction('Add a section'))
      .subscribe();

    expect(service.chat).toHaveBeenCalledWith(
      'Add a section',
      [{ role: 'assistant', content: 'Hi' }],
      '',
    );
    expect(mirror).toHaveBeenCalledWith([CHANGE], REFRESH);
    expect(model.messages[2]).toEqual({
      role: 'assistant',
      content: 'Added.',
      changes: [CHANGE],
    });
    expect(model.isLoading).toBeFalse();
    expect(
      JSON.parse(localStorage.getItem('berta_ai_chat_')!).messages.length,
    ).toBe(3);
  });

  it('adds a reply without changes as plain text', () => {
    service.chat.and.returnValue(
      of({
        reply: 'You have one section.',
        changes: [],
        refresh: { site_data: {} },
      }),
    );

    state
      .sendMessage(context, new SendAiMessageAction('What sections?'))
      .subscribe();

    expect(model.messages[1]).toEqual({
      role: 'assistant',
      content: 'You have one section.',
    });
  });

  it('puts the message back when the daily limit is reached', () => {
    service.chat.and.returnValue(
      throwError(() => ({ status: 429, error: { message: 'Limit reached.' } })),
    );

    state.sendMessage(context, new SendAiMessageAction('Hello')).subscribe();

    expect(model.messages).toEqual([]);
    expect(model.pendingInput).toBe('Hello');
    expect(model.dailyLimitMessage).toBe('Limit reached.');
  });

  it("undoes a reply's changes and shows them in the editor", () => {
    model.messages = [
      { role: 'assistant', content: 'Added.', changes: [CHANGE] },
    ];
    const undoChange = { ...CHANGE, change_id: '8', action: 'remove' };
    service.undo.and.returnValue(
      of({
        undone: ['7'],
        refusal: null,
        changes: [undoChange],
        refresh: REFRESH,
      }),
    );

    state.undoMessage(context, new UndoAiMessageAction(0)).subscribe();

    expect(service.undo).toHaveBeenCalledWith(['7']);
    expect(mirror).toHaveBeenCalledWith([undoChange], REFRESH);
    expect(model.messages[0]).toEqual(
      jasmine.objectContaining({ undone: true, changes: [] }),
    );
    expect(model.undoingIndex).toBeNull();
  });

  it('says why changes could not be undone, and keeps them to try again', () => {
    model.messages = [
      { role: 'assistant', content: 'Added.', changes: [CHANGE] },
    ];
    service.undo.and.returnValue(
      of({
        undone: [],
        refusal: 'It was changed since.',
        changes: [],
        refresh: { site_data: {} },
      }),
    );

    state.undoMessage(context, new UndoAiMessageAction(0)).subscribe();

    expect(model.messages[0]).toEqual(
      jasmine.objectContaining({
        undone: false,
        undoRefusal: 'It was changed since.',
        changes: [CHANGE],
      }),
    );
  });
});
