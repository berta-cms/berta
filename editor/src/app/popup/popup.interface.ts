import { PopupService } from './popup.service';

export interface PopupState {
  type: 'error' | 'warn' | 'info' | 'success' | Object;
  content: any;
  showOverlay?: boolean;
  isModal?: boolean;
  timeout?: number;
  onTimeout?: (popupService: PopupService) => void;
  actions?: PopupAction[];
}

export interface PopupAction {
  label: string;
  callback?: (popupService: PopupService) => void;
  type?: 'primary' | 'secondary';
}
