import { SiteStateModel } from '../../sites-state/site-state.model';

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
