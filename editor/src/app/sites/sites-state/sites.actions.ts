import { SiteStateModel } from './site-state.model';

export class CreateSiteAction {
  static readonly type = 'SITE:CREATE';
  constructor(public site?: SiteStateModel) {}
}

export class UpdateSiteAction {
  static readonly type = 'SITE:UPDATE';
  constructor(
    public site: SiteStateModel,
    public field: string,
    public value: string,
  ) {}
}

export class RenameSiteAction {
  static readonly type = 'SITE:RENAME';
  constructor(
    public site: SiteStateModel,
    public value: string,
  ) {}
}

export class CloneSiteAction {
  static readonly type = 'SITE:CLONE';
  constructor(public site: SiteStateModel) {}
}

export class DeleteSiteAction {
  static readonly type = 'SITE:DELETE';
  constructor(public site: SiteStateModel) {}
}

export class ReOrderSitesAction {
  static readonly type = 'SITE:REORDER';
  constructor(
    public currentOrder: number,
    public payload: number,
  ) {}
}

export class ResetSitesAction {
  static readonly type = 'SITE:RESET';
}

export class InitSitesAction {
  static readonly type = 'SITE:INIT';
  constructor(public payload: SiteStateModel[]) {}
}

export class PreviewThemeSitesAction {
  static readonly type = 'SITE:PREVIEW_THEME';
  constructor(public payload: { site: string; theme: string }) {}
}

export class ApplyThemeSitesAction {
  static readonly type = 'SITE:APPLY_THEME';
  constructor(public payload: { site: string; theme: string }) {}
}

export class SwapContentsSitesAction {
  static readonly type = 'SITE:SWAP_CONTENTS';
  constructor(public payload: { siteSlugFrom: string; siteSlugTo: string }) {}
}

/**
 * The store got fresh content of a site from the server (e.g. after AI chat changes): its sites list, sections,
 * entries or tags. The preview re-renders its menus and entries, as it does after the editor's own edits.
 */
export class SiteContentRefreshedAction {
  static readonly type = 'SITE:CONTENT_REFRESHED';
  constructor(public siteName: string) {}
}
