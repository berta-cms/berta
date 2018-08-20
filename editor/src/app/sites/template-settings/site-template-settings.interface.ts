export interface SitesTemplateSettingsStateModel {
  [siteName: string]: SiteTemplateSettingsModel;
}

export interface SiteTemplateSettingsModel {
  [settingGroup: string]: any;
}

export interface SiteTemplatesStateModel {
  default?: TemplateModel;
  'mashup-0.3.5'?: TemplateModel;
  'messy-0.4.2'?: TemplateModel;
  'white-0.3.5'?: TemplateModel;
}

export interface TemplateModel {
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
