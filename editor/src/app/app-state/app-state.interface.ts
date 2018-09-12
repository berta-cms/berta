export interface AppStateModel {
  showOverlay: boolean;
  isLoading: boolean;
  inputFocused: boolean;
  site: string | null;
  urls: {name: string}[];
}
