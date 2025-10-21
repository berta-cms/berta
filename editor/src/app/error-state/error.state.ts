import {
  State,
  StateContext,
  Selector,
  NgxsOnInit,
  Store,
  Action,
} from '@ngxs/store';
import { ErrorStateModel } from './error.interface';
import { PopupService } from '../popup/popup.service';
import { filter } from 'rxjs/operators';
import { PushErrorAction } from './error.actions';
import { Injectable } from '@angular/core';

const defaultState: ErrorStateModel[] = [];

@State<ErrorStateModel[]>({
  name: 'error',
  defaults: defaultState,
})
@Injectable()
export class ErrorState implements NgxsOnInit {
  @Selector()
  static getLastError(state: ErrorStateModel[]) {
    if (state.length === 0) {
      return;
    }
    return state[state.length - 1];
  }

  constructor(
    private store: Store,
    private popupService: PopupService,
  ) {}

  ngxsOnInit() {
    this.store
      .select(ErrorState.getLastError)
      .pipe(filter((lastError) => !!lastError))
      .subscribe((lastError: ErrorStateModel) => {
        this.popupService.showPopup({
          type: 'error',
          content:
            (lastError.httpStatus ? `${lastError.httpStatus}: ` : '') +
            lastError.message,
          timeout: 3000,
        });
      });
  }

  @Action(PushErrorAction)
  pushError(
    { getState, setState }: StateContext<ErrorStateModel[]>,
    action: PushErrorAction,
  ) {
    setState([...getState(), action.payload]);
  }
}
