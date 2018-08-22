import { SettingGroupResponse } from '../../shared/interfaces';

export interface SiteSettingsConfigStateModel {
  [settingGroupName: string]: SiteSettingsConfigGroup;
}

export interface SiteSettingsConfigGroup {
  _: SiteSettingsSectionMeta;
  [settingName: string]: SiteSettingsConfigSetting;
}

export interface SiteSettingsSectionMeta extends SiteSettingsConfigSetting {
  title: string;
  invisible?: boolean;
}

export interface SiteSettingsConfigSetting {
  value: any;
  default: any;
  format: string;
  title?: string;
  [k: string]: any;
}


/* Responses */
export interface SiteSettingsConfigResponse {
  [settingGroupName: string]: SettingGroupResponse;
}
