import { SiteStateModel } from './site-state.model';

export class CreateSiteAction {
  static readonly type = 'SITE:CREATE';
  constructor(public site?: SiteStateModel) {
  }
}

export class UpdateSiteAction {
  static readonly type = 'SITE:UPDATE';
  constructor(
    public site: SiteStateModel,
    public field: string,
    public value: string) {
  }
}

export class RenameSiteAction {
  static readonly type = 'SITE:RENAME';
  constructor(
    public site: SiteStateModel,
    public value: string) {
  }
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

export class ResetSitesAction {
  static readonly type = 'SITE:RESET';
}
