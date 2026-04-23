export class ToggleAiAssistantAction {
  static readonly type = 'AI_ASSISTANT:TOGGLE';
}

export class SendAiMessageAction {
  static readonly type = 'AI_ASSISTANT:SEND_MESSAGE';
  constructor(public message: string) {}
}

export class AiMessageReceivedAction {
  static readonly type = 'AI_ASSISTANT:MESSAGE_RECEIVED';
  constructor(
    public reply: string,
    public designChanges: { group: string; setting: string; value: string; previous_value?: string | null }[],
    public settingsChanges: { group: string; setting: string; value: string; previous_value?: string | null }[],
    public sectionChanges: { operation: string; name?: string; title?: string; property?: string; value?: string; previous_value?: string | null; order?: number }[],
    public isUndo: boolean = false,
    public entryChanges: { operation: 'create' | 'update' | 'delete'; section?: string; entry_id?: string; value?: string; previous_value?: string | null; description?: string }[] = [],
    public galleryChanges: { operation: 'update_setting' | 'update_caption'; section?: string; entry_id?: string; setting?: string; file_index?: number; value?: string; previous_value?: string | null }[] = [],
  ) {}
}

export class ClearAiChatAction {
  static readonly type = 'AI_ASSISTANT:CLEAR';
}

export class SubmitAiFeedbackAction {
  static readonly type = 'AI_ASSISTANT:SUBMIT_FEEDBACK';
  constructor(public messageIndex: number, public vote: 'up' | 'down') {}
}
