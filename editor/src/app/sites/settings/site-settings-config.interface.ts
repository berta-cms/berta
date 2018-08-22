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

export interface SettingGroupResponse {
  _?: {
    title?: string;
    invisible?: boolean;
    [k: string]: any;
  };
  [settingSlug: string]: {
    default?: null | string | number | boolean;
    description?: string;
    title?: string;
    format?:
      | 'text'
      | 'longtext'
      | 'select'
      | 'fontselect'
      | 'icon'
      | 'image'
      | 'color'
      | boolean;
    values?:
      | (string | number)[]
      | {
          [k: string]: string | number;
        };
    html_entities?: boolean;
    css_units?: boolean;
    min_width?: number | string;
    min_height?: number | string;
    max_width?: number | string;
    max_height?: number | string;
    allow_blank?: boolean;
    link?: boolean;
    validator?: 'GoogleAnalytics' | string;
    [k: string]: any;
  };
}
