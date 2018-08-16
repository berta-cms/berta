import { SiteStateModel } from '../../../sites-state/site-state.model';

export class DeleteSiteSectionsEntriesAction {
  static readonly type = 'SITE_SECTIONS_ENTRIES:DELETE';
  constructor(public siteName: string) {
  }
}

export class RenameSectionEntriesSitenameAction {
  static readonly type = 'SITE_SECTIONS_ENTRIES_SITENAME:RENAME';
  constructor(
    public site: SiteStateModel,
    public siteName: string) {
  }
}
