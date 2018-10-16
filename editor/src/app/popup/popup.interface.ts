import { PopupService } from './popup.service';

export interface PopupState {
  type: 'error'|'warning'|'info'|'success'|Object;
  content: any;
  showOverlay?: boolean;
  isModal?: boolean;
  timeout?: number;
  onTimeout?: (popupService: PopupService) => void;
}
