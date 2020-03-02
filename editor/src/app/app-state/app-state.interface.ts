export interface AppStateModel {
  setup: boolean;
  showOverlay: boolean;
  isLoading: boolean;
  inputFocused: boolean;
  site: string | null;
  section: string | null;
  urls: {[name: string]: string};
  forgotPasswordUrl: string;
  isBertaHosting: boolean;
  loginUrl: string;
  authenticateUrl: string;
  version: string;
  lastRoute: string;
  themes: string[];
}
