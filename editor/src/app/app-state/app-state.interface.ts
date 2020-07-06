export interface PlanModel {
  id: string,
  name: string,
  features: string[]
}

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
  plans: PlanModel[];
  loginUrl: string;
  authenticateUrl: string;
  version: string;
  lastRoute: string;
  themes: string[];
}
