export interface AppStateModel {
  showOverlay: boolean;
  isLoading: boolean;
  site: string | null;
  urls: {[name: string]: string};
}
