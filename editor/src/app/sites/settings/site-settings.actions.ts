import { SiteStateModel } from '../sites-state/site-state.model';
import { SiteSettingsResponse } from './site-settings.interface';

export class CreateSiteSettingsAction {
  static readonly type = 'SITE_SETTINGS:CREATE';
  constructor(
    public site: SiteStateModel,
    public settings: SiteSettingsResponse,
  ) {}
}

export class UpdateSiteSettingsAction {
  static readonly type = 'SITE_SETTINGS:UPDATE';
  constructor(
    public settingGroup: string,
    public payload: { [k: string]: any },
  ) {}
}

export class UpdateNavigationSiteSettingsAction {
  static readonly type = 'SITE_SETTINGS_NAVIGATION:UPDATE';
  constructor(public payload: { [k: string]: any }) {}
}
export class HandleSiteSettingsChildrenChangesAction {
  static readonly type = 'SITE_SETTINGS:HANDLE_CHILDREN_CHANGES';
  constructor(
    public settingGroup: string,
    public payload?: any,
  ) {}
}

export class UpdateSiteSettingsFromSyncAction {
  static readonly type = 'SITE_SETTINGS:UPDATE:SYNC';
  constructor(
    public path: string,
    public payload: any,
  ) {}
}

export class RenameSiteSettingsSitenameAction {
  static readonly type = 'SITE_SETTINGS_SITENAME:RENAME';
  constructor(
    public site: SiteStateModel,
    public siteName: string,
  ) {}
}

export class DeleteSiteSettingsAction {
  static readonly type = 'SITE_SETTINGS:DELETE';
  constructor(public siteName: string) {}
}

export class ResetSiteSettingsAction {
  static readonly type = 'SITE_SETTINGS:RESET';
}

export class InitSiteSettingsAction {
  static readonly type = 'SITE_SETTINGS:INIT';
  constructor(public payload: SiteSettingsResponse) {}
}

export class AddSiteSettingChildrenAction {
  static readonly type = 'SITE_SETTINGS:ADD_CHILDREN';
  constructor(
    public settingGroup: string,
    public slug: string,
    public payload: any,
  ) {}
}

export class DeleteSiteSettingChildrenAction {
  static readonly type = 'SITE_SETTINGS:DELETE_CHILDREN';
  constructor(
    public settingGroup: string,
    public slug: string,
    public payload: number,
  ) {}
}

export class UpdateSiteSettingChildrenAction {
  static readonly type = 'SITE_SETTINGS:UPDATE_CHILDREN';
  constructor(
    public settingGroup: string,
    public slug: string,
    public index: number,
    public payload: { [k: string]: any },
  ) {}
}
