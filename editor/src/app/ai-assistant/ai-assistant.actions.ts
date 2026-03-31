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
  ) {}
}

export class ClearAiChatAction {
  static readonly type = 'AI_ASSISTANT:CLEAR';
}
