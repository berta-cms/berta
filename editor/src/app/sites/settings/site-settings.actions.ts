import { SiteStateModel } from '../sites-state/site-state.model';
import { SiteSettingsModel } from './site-settings.interface';

export class CreateSiteSettingsAction {
  static readonly type = 'SITE_SETTINGS:CREATE';
  constructor(public site: SiteStateModel,
              public settings: SiteSettingsModel) {
  }
}

export class UpdateSiteSettingsAction {
  static readonly type = 'SITE_SETTINGS:UPDATE';
  constructor(public settingGroup: string,
              public payload: {[k: string]: any}) {
  }
}

export class RenameSiteSettingsSitenameAction {
  static readonly type = 'SITE_SETTINGS_SITENAME:RENAME';
  constructor(
    public site: SiteStateModel,
    public siteName: string) {
  }
}

export class DeleteSiteSettingsAction {
  static readonly type = 'SITE_SETTINGS:DELETE';
  constructor(public siteName: string) {
  }
}
