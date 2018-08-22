export interface SiteTemplatesStateModel {
  default?: TemplateSiteModel;
  'mashup-0.3.5'?: TemplateSiteModel;
  'messy-0.4.2'?: TemplateSiteModel;
  'white-0.3.5'?: TemplateSiteModel;
}

export interface TemplateSiteModel {
  templateConf: TemplateConfModel;
  sectionTypes: SectionTypes;
}

export interface TemplateConfModel extends TemplateModelResponse {
  values?: { [k: string]: string | number; };
}

/* Response: */
export interface SiteTemplatesResponseModel {
  default?: TemplateModelResponse;
  'mashup-0.3.5'?: TemplateModelResponse;
  'messy-0.4.2'?: TemplateModelResponse;
  'white-0.3.5'?: TemplateModelResponse;
}

export interface TemplateModelResponse {
  templateConf: TemplateConfResponse;
  sectionTypes: SectionTypes;
}

export interface TemplateConfResponse {
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
