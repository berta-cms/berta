import { SettingConfigGroupResponse, SettingGroupConfigModel, SettingConfigModel, SettingConfigResponse } from '../../shared/interfaces';

export interface SiteTemplatesStateModel {
  default?: TemplateSiteModel;
  'mashup-0.3.5'?: TemplateSiteModel;
  'messy-0.4.2'?: TemplateSiteModel;
  'white-0.3.5'?: TemplateSiteModel;
}

export interface TemplateSiteModel {
  templateConf: {
    [settingGroupSlug: string]: SettingGroupConfigModel
  };
  sectionTypes: SiteTemplateSectionTypesModel;
}

export interface SiteTemplateSectionTypesModel {
  [sectionTypeSlug: string]: {
    title: string;
    params?: {
      [paramSlug: string]: SettingConfigModel;
    }
    [k: string]: any;
  };
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
  sectionTypes: SiteTemplateSectionTypesResponse;
}

export interface TemplateConfResponse {
  [settingGroupSlug: string]: SettingConfigGroupResponse;
}

export interface SiteTemplateSectionTypesResponse {
  [sectionTypeSlug: string]: {
    title: string;
    params?: {
      [paramSlug: string]: SettingConfigResponse;
    }
    [k: string]: any;
  };
}
