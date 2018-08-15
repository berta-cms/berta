import { SiteStateModel } from '../../sites-state/site-state.model';
import { SiteSectionStateModel } from '../sections-state/site-sections-state.model';
import { SectionTagsInterface } from './section-tags-state.model';

export class AddSectionTagsAction {
  static readonly type = 'SECTION_TAGS:ADD';
  constructor(public siteName: string,
              public tags: SectionTagsInterface[]) {
  }
}

export class AddSiteSectionsTagsAction {
  static readonly type = 'SITE_SECTIONS_TAGS:ADD';
  constructor(public site: SiteStateModel,
              public tags: SectionTagsInterface[]) {
  }
}

export class RenameSectionTagsAction {
  static readonly type = 'SECTION_TAGS:RENAME';
  constructor(public section: SiteSectionStateModel,
              public newSectionName: string) {
  }
}

export class DeleteSectionTagsAction {
  static readonly type = 'SECTION_TAGS:DELETE';
  constructor(public section: SiteSectionStateModel) {
  }
}

export class DeleteSiteSectionsTagsAction {
  static readonly type = 'SITE_SECTIONS_TAGS:DELETE';
  constructor(public siteName: string) {
  }
}

export class RenameSectionTagsSitenameAction {
  static readonly type = 'SITE_SECTIONS_TAGS_SITENAME:RENAME';
  constructor(
    public site: SiteStateModel,
    public siteName: string) {
  }
}
