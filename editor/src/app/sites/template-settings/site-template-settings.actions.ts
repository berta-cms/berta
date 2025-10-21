import { SiteStateModel } from '../sites-state/site-state.model';
import {
  SitesTemplateSettingsSiteResponse,
  SitesTemplateSettingsResponse,
} from './site-template-settings.interface';

export class CreateSiteTemplateSettingsAction {
  static readonly type = 'SITE_TEMPLATE_SETTINGS:CREATE';
  constructor(
    public site: SiteStateModel,
    public templateSettings: SitesTemplateSettingsSiteResponse,
  ) {}
}

export class UpdateSiteTemplateSettingsAction {
  static readonly type = 'SITE_TEMPLATE_SETTINGS:UPDATE';
  constructor(
    public settingGroup: string,
    public payload: { [k: string]: any },
  ) {}
}

export class HandleSiteTemplateSettingsAction {
  static readonly type = 'SITE_TEMPLATE_SETTINGS:HANDLE_CHANGES';
  constructor(
    public settingGroup: string,
    public payload?: { [k: string]: any },
  ) {}
}

export class RenameSiteTemplateSettingsSitenameAction {
  static readonly type = 'SITE_TEMPLATE_SETTINGS_SITENAME:RENAME';
  constructor(
    public site: SiteStateModel,
    public siteName: string,
  ) {}
}

export class DeleteSiteTemplateSettingsAction {
  static readonly type = 'SITE_TEMPLATE_SETTINGS:DELETE';
  constructor(public siteName: string) {}
}

export class ResetSiteTemplateSettingsAction {
  static readonly type = 'SITE_TEMPLATE_SETTINGS:RESET';
}

export class ResetToDefaultsSiteTemplateSettingsAction {
  static readonly type = 'SITE_TEMPLATE_SETTINGS:RESET_TO_DEFAULTS';
  constructor(
    public siteName: string,
    public templateName: string,
  ) {}
}

export class InitSiteTemplateSettingsAction {
  static readonly type = 'SITE_TEMPLATE_SETTINGS:INIT';
  constructor(public payload: SitesTemplateSettingsResponse) {}
}
