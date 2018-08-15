import { SiteStateModel } from '../../../sites-state/site-state.model';
import { SiteSectionStateModel } from '../../sections-state/site-sections-state.model';
import { SectionEntry } from './section-entries-state.model';

export class AddSectionEntriesAction {
  static readonly type = 'SECTION_ENTRIES:ADD';
  constructor(public siteName: string,
              public entries: SectionEntry[]) {
  }
}

export class AddSiteEntriesAction {
  static readonly type = 'SITE_SECTIONS_ENTRIES:ADD';
  constructor(public site: SiteStateModel,
              public entries: SectionEntry[]) {
  }
}

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

export class RenameSectionEntriesAction {
  static readonly type = 'SECTION_ENTRIES:RENAME';
  constructor(public section: SiteSectionStateModel,
              public newSectionName: string) {
  }
}

export class RenameSectionEntriesSitenameAction {
  static readonly type = 'SITE_SECTIONS_ENTRIES_SITENAME:RENAME';
  constructor(
    public site: SiteStateModel,
    public siteName: string) {
  }
}
