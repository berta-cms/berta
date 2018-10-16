import { Injectable } from '@angular/core';
import { BehaviorSubject, PartialObserver } from 'rxjs';
import { PopupState } from './popup.interface';

@Injectable({
  providedIn: 'root'
})
export class PopupService {

  popupState$: BehaviorSubject<PopupState|null> = new BehaviorSubject(null);

  /* ToDo subscribe to error-state, to automatically show errors */
  constructor() { }

  subscribe(observer: PartialObserver<PopupState|null>) {
    return this.popupState$.subscribe(observer);
  }

  showPopup(popupState: PopupState) {
    this.popupState$.next(popupState);
  }

  closePopup() {
    this.popupState$.next(null);
  }
}
