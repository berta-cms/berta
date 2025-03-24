import { ErrorStateModel } from './error.interface';

export class PushErrorAction {
  static readonly type = 'SITE:PUSH';
  constructor(public payload: ErrorStateModel) {}
}
