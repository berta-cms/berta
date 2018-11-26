import { SettingConfigGroupResponse } from '../../shared/interfaces';

export interface SiteSettingsConfigStateModel {
  [settingGroupName: string]: SiteSettingsConfigGroup;
}

export interface SiteSettingsConfigGroup extends SettingConfigGroupResponse {
  values?: { [k: string]: string | number; };
}


/* Responses */
export interface SiteSettingsConfigResponse {
  [settingGroupName: string]: SettingConfigGroupResponse;
}
