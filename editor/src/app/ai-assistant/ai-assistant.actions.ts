import { AiApproval, AiChange } from './ai-assistant.service';

export class ToggleAiAssistantAction {
  static readonly type = 'AI_ASSISTANT:TOGGLE';
}

export class SendAiMessageAction {
  static readonly type = 'AI_ASSISTANT:SEND_MESSAGE';
  constructor(public message: string) {}
}

export class AiReplyReceivedAction {
  static readonly type = 'AI_ASSISTANT:REPLY_RECEIVED';
  constructor(
    public reply: string,
    public changes: AiChange[],
    public approvals: AiApproval[] = [],
  ) {}
}

/** Approves or rejects a delete the assistant message at this index waits on. */
export class ResolveAiApprovalAction {
  static readonly type = 'AI_ASSISTANT:RESOLVE_APPROVAL';
  constructor(
    public messageIndex: number,
    public approvalId: string,
    public approve: boolean,
  ) {}
}

/** Undoes the changes of the assistant message at this index. */
export class UndoAiMessageAction {
  static readonly type = 'AI_ASSISTANT:UNDO_MESSAGE';
  constructor(public messageIndex: number) {}
}

export class ClearAiChatAction {
  static readonly type = 'AI_ASSISTANT:CLEAR';
}

export class FetchAiQuotaAction {
  static readonly type = 'AI_ASSISTANT:FETCH_QUOTA';
}

export class AiQuotaFetchedAction {
  static readonly type = 'AI_ASSISTANT:QUOTA_FETCHED';
  constructor(public usage: { count: number; limit: number }) {}
}

export class SubmitAiFeedbackAction {
  static readonly type = 'AI_ASSISTANT:SUBMIT_FEEDBACK';
  constructor(
    public messageIndex: number,
    public vote: 'up' | 'down',
  ) {}
}
