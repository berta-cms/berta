import { SiteStateModel } from '../../sites-state/site-state.model';
import { SiteSectionStateModel } from '../sections-state/site-sections-state.model';

export class UpdateSiteSectionAction {
  static readonly type = 'SITE_SECTION:UPDATE';
  constructor(public siteName: string,
              public order: number,
              public payload: {[k: string]: any}) {
  }
}

export class RenameSiteSectionsSitenameAction {
  static readonly type = 'SITE_SECTIONS_SITENAME:RENAME';
  constructor(
    public site: SiteStateModel,
    public siteName: string) {
  }
}

export class DeleteSiteSectionAction {
  static readonly type = 'SITE_SECTION:DELETE';
  constructor(public section: SiteSectionStateModel) {
  }
}

export class DeleteSiteSectionsAction {
  static readonly type = 'SITE_SECTIONS:DELETE';
  constructor(public siteName: string) {
  }
}
