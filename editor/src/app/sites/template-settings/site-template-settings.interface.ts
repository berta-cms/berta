/** @todo sort out these interfaces  */

/* -> site template settings */
export interface SitesTemplateSettingsStateModel {
  [siteName: string]: TemplateSettingsSiteModel;
}

export interface TemplateSettingsSiteModel {
  default?: SettingsGroupModel[];
  'mashup-0.3.5'?: SettingsGroupModel[];
  'messy-0.4.2'?: SettingsGroupModel[];
  'white-0.3.5'?: SettingsGroupModel[];
}
/* Response */
export interface SitesTemplateSettingsResponseModel {
  [siteName: string]: any;
}
/* <- */

/* -> site templates */
export interface SiteTemplatesStateModel {
  default?: TemplateSiteModel;
  'mashup-0.3.5'?: TemplateSiteModel;
  'messy-0.4.2'?: TemplateSiteModel;
  'white-0.3.5'?: TemplateSiteModel;
}

export interface TemplateSiteModel {
  templateConf: TemplateConf;
  sectionTypes: SectionTypes;
}

/* <- */

export interface SettingsGroupModel {
  slug: string;
  settings: SettingModel[];
}

export interface SettingModel {
  slug: string;
  value: string|number|boolean;
}

/** @todo: Add template settings response model */
export interface SiteTemplatesResponseModel {
  default?: TemplateModelResponse;
  'mashup-0.3.5'?: TemplateModelResponse;
  'messy-0.4.2'?: TemplateModelResponse;
  'white-0.3.5'?: TemplateModelResponse;
}

export interface TemplateModelResponse {
  templateConf: TemplateConf;
  sectionTypes: SectionTypes;
}

export interface TemplateConf {
  [settingGroupSlug: string]: {
    _?: {
      title?: string;
      [k: string]: any;
    };
    [settingSlug: string]: {
      default?: string | number | boolean;
      description?: string;
      title?: string;
      format?: string | boolean;
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
      [k: string]: any;
    };
  };
}

export interface SectionTypes {
  [sectionTypeSlug: string]: {
    title: string;
    params?: {
      [paramSlug: string]: {
        default?: string | number;
        format?: string;
        values?:
          | Array<(string | number)>
          | {
              [k: string]: string | number
            }
          | Array<{
            title: string;
            value: string|number;
          }>;
        html_entities?: boolean;
        css_units?: boolean;
        allow_blank?: boolean;
        html_before?: string;
        html_after?: string;
        [k: string]: any;
      };
    };
    [k: string]: any;
  };
}
