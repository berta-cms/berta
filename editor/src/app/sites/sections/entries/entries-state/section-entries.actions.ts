import { SiteStateModel } from '../../../sites-state/site-state.model';
import { SiteSectionStateModel } from '../../sections-state/site-sections-state.model';

export class DeleteSectionEntriesAction {
  static readonly type = 'SECTION_ENTRIES:DELETE';
  constructor(public section: SiteSectionStateModel) {
  }
}

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
