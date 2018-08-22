export interface SettingsGroupModel {
  slug: string;
  settings: SettingModel[];
}

export interface SettingModel {
  slug: string;
  value: string|number|boolean;
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
