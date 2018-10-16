import { Component, OnInit } from '@angular/core';
import { PopupService } from './popup.service';
import { PopupState, PopupAction } from './popup.interface';


/*
TODO:
- Subscribe to errors
- Add ability to show component
*/

@Component({
  selector: 'berta-popup',
  template: `
  <div *ngIf="!!popupState" class="bt-popup-wrap">
    <div class="bt-popup-content"
         [class.bt-popup-info]="popupType === 'info'"
         [class.bt-popup-warn]="popupType === 'warn'"
         [class.bt-popup-error]="popupType === 'error'"
         [class.bt-popup-success]="popupType === 'success'">
      {{ popupState.content }}
      <div *ngIf="actions" class="bt-popup-action-wrap">
        <button type="button"
                [class.bt-primary]="action.type === 'primary'"
                [class.bt-secondary]="action.type !== 'primary'"
                (click)="actionClick(action, $event)"
                *ngFor="let action of actions">{{ action.label }}</button>
      </div>
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
  `]
})
export class PopupComponent implements OnInit {
  popupState: PopupState = null;
  popupTimer: any;
  popupType = 'info';
  actions: PopupAction[] = null;

  constructor(private service: PopupService) { }

  ngOnInit() {
    this.service.subscribe({
      next: (popupState: PopupState) => {
        if (this.popupTimer) {
          clearTimeout(this.popupTimer);
          this.popupTimer = null;
        }
        this.popupState = popupState;

        if (popupState) {
          this.popupType = typeof popupState.type === 'string' ? popupState.type : 'info';
          this.actions = popupState.actions;

          if (popupState.timeout) {
            this.popupTimer = setTimeout(() => {
              if (popupState.onTimeout instanceof Function) {
                popupState.onTimeout(this.service);
              } else {
                this.service.closePopup();
              }
            }, popupState.timeout);
          }

          /*
           * Add default action for modal popup if no action is passed, otherwise, user can't exit
           * You can make completely un-closable popup by passing empty actions array
           */
          if (popupState.isModal && !popupState.actions && !popupState.timeout) {
            this.actions = [{
              type: 'primary',
              label: 'OK'
            }];
          }
        } else {
          this.actions = null;
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

  actionClick(action: PopupAction, event: Event) {
    if (action.callback instanceof Function) {
      action.callback(this.service);
    } else {
      this.service.closePopup();
    }
  }
}
