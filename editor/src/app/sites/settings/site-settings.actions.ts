import { SiteStateModel } from '../sites-state/site-state.model';
import { SiteSettingsResponse } from './site-settings.interface';
import { SettingModel } from '../../shared/interfaces';

export class CreateSiteSettingsAction {
  static readonly type = 'SITE_SETTINGS:CREATE';
  constructor(public site: SiteStateModel,
              public settings: SiteSettingsResponse) {
  }
}

export class UpdateSiteSettingsAction {
  static readonly type = 'SITE_SETTINGS:UPDATE';
  constructor(public settingGroup: string,
              public payload: {[k: string]: any}) {
  }
}
export class UpdateSiteSettingsFailAction {
  static readonly type = 'SITE_SETTINGS:UPDATE:FAIL';
  constructor(public error: string) {
  }
}

export class UpdateSiteSettingsSuccessAction {
  static readonly type = 'SITE_SETTINGS:UPDATE:SUCCESS';
  constructor(public site: string,
              public settingGroup: string,
              public setting: string,
              public payload: SettingModel['value']) {
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
