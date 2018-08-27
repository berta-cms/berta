import { SiteTemplatesResponseModel } from './site-templates.interface';

export class ResetSiteTemplatesAction {
  static readonly type = 'SITE_TEMPLATES:RESET';
}

export class InitSiteTemplatesAction {
  static readonly type = 'SITE_TEMPLATES:INIT';
  constructor(public payload: SiteTemplatesResponseModel) {}
}
