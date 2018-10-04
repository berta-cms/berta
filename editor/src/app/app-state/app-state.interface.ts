export interface AppStateModel {
  showOverlay: boolean;
  isLoading: boolean;
  inputFocused: boolean;
  site: string | null;
  urls: {[name: string]: string};
  forgotPasswordUrl: string;
  internalVersion: string;
  isBertaHosting: boolean;
  loginUrl: string;
  version: string;
}
