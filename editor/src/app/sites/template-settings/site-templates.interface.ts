import { SettingGroupResponse } from '../../shared/interfaces';

export interface SiteTemplatesStateModel {
  default?: TemplateSiteModel;
  'mashup-0.3.5'?: TemplateSiteModel;
  'messy-0.4.2'?: TemplateSiteModel;
  'white-0.3.5'?: TemplateSiteModel;
}

export interface TemplateSiteModel {
  templateConf: TemplateConfModel;
  sectionTypes: SiteTemplateSectionTypes;
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
  sectionTypes: SiteTemplateSectionTypes;
}

export interface TemplateConfResponse {
  [settingGroupSlug: string]: SettingGroupResponse;
}

export interface SiteTemplateSectionTypes {
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
