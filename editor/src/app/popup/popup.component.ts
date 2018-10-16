import { Component, OnInit } from '@angular/core';
import { PopupService } from './popup.service';
import { PopupState } from './popup.interface';


/*
TODO:
- Style the popup component
- Add actions to popup
- Subscribe to errors
- Add ability to show component
*/

@Component({
  selector: 'berta-popup',
  template: `
  <div *ngIf="!!popupState" class="bt-popup-wrap">
    <div class="bt-popup-content">
      {{ popupState.content }}
    </div>
  </div>
  <div *ngIf="popupState && (popupState.showOverlay || popupState.isModal)"
       class="bt-popup-overlay"
       (click)="overlayClick($event)"></div>
  `,
  styles: [`
    .bt-popup-wrap {
      display: flex;
      position: fixed;
      z-index: 11;
      top: 0;
      width: 100%;
      flex-direction: row;
      justify-content: center;
      align-items: center;
    }
    .bt-popup-overlay {
      position: fixed;
      z-index: 10;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      width: 100%;
      height: 100%;
    }

    /* VISUAL STYLES, to be moved to theme: */
    .bt-popup-wrap {
      padding: 2rem;
    }
    .bt-popup-content {
      background-color: white;
      color: black;
    }
    .bt-popup-overlay {
      background: rgba(0,0,0, .4);
    }
  `]
})
export class PopupComponent implements OnInit {
  popupState: PopupState = null;
  popupTimer: any;

  constructor(private service: PopupService) { }

  ngOnInit() {
    this.service.subscribe({
      next: (popupState: PopupState) => {
        if (this.popupTimer) {
          clearTimeout(this.popupTimer);
          this.popupTimer = null;
        }
        this.popupState = popupState;

        if (popupState && popupState.timeout) {
          this.popupTimer = setTimeout(() => {
            if (popupState.onTimeout instanceof Function) {
              popupState.onTimeout(this.service);
            } else {
              this.service.closePopup();
            }
          }, popupState.timeout);

          let intervals = 1;
          const interval = setInterval(() => {
            console.log(popupState.timeout / 1000 - intervals);
            if ((popupState.timeout / 1000 - intervals) <= 0) {
              clearInterval(interval);
            }
            intervals ++;
          }, 1000);
        }
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  overlayClick(event: Event) {
    /* Modal popups require action! */
    if (this.popupState && this.popupState.isModal) {
      event.stopPropagation();
      return false;
    }
    this.service.closePopup();
  }
}
