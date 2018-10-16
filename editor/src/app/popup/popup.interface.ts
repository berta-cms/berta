export interface PopupState {
  type: 'error'|'warning'|'info'|'success'|Object;
  hasOverlay?: boolean;
  isModal?: boolean;
  component?: Object;
  timeout?: number;
  onTimeout?: Function;
}

/*
- hasOverlay: bool
- isModal: bool
- type: error|warning|info|success|component
- component?: Component
- timeout: miliseconds
- onTimeout: function
*/
