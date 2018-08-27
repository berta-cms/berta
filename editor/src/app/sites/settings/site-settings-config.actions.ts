import { SiteSettingsConfigResponse } from './site-settings-config.interface';

export class ResetSiteSettingsConfigAction {
  static readonly type = 'SITE_SETTINGS_CONFIG:RESET';
}

export class InitSiteSettingsConfigAction {
  static readonly type = 'SITE_SETTINGS_CONFIG:INIT';
  constructor(public payload: SiteSettingsConfigResponse) {}
}
