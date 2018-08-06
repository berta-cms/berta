import { SiteStateModel } from './site-state.model';

export class CreateSiteAction {
  static readonly type = 'SITE:CREATE';
}

export class CloneSiteAction {
  static readonly type = 'SITE:CLONE';
  constructor(public site: SiteStateModel) {
  }
}

export class DeleteSiteAction {
  static readonly type = 'SITE:DELETE';
  constructor(public site: SiteStateModel) {
  }
}