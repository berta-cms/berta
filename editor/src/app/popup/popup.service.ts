import { Injectable } from '@angular/core';
import { BehaviorSubject, PartialObserver } from 'rxjs';
import { PopupState } from './popup.interface';

@Injectable({
  providedIn: 'root'
})
export class PopupService {

  popupState$: BehaviorSubject<PopupState|null> = new BehaviorSubject(null);

  /** @example
   * In a component import the popup service, then you can ues it like so:
   ```
   this.popupService.showPopup({
      type: 'info',
      content: 'This is info message!',
      showOverlay: true,
      timeout: 1000 * 10,
      actions: [
        {
          label: 'OK',
          type: 'primary'
        },
        {
          label: 'not OK',
          callback: (popupService) => { console.log('not OK'); }
        }
      ],

      onTimeout: (popupService) => {
        popupService.closePopup();
        this.popupService.showPopup({
          type: '',
          content: 'Info has left the popup!',
          timeout: 1000
        });
      }
    });
    ```
   */

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
