export interface SitesSettingsStateModel {
  [siteName: string]: SiteSettingsModel;
}

export interface SiteSettingsModel {
  [k: string]: any;
}
