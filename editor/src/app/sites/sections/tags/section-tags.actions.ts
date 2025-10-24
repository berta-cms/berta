import { SiteStateModel } from '../../sites-state/site-state.model';
import { SiteSectionStateModel } from '../sections-state/site-sections-state.model';
import {
  SectionTagsInterface,
  SectionTagsStateModel,
} from './section-tags-state.model';

export class UpdateSectionTagsAction {
  static readonly type = 'SECTION_TAGS:UPDATE';
  constructor(
    public siteName: string,
    public sectionName: string,
    public tags: SectionTagsInterface,
  ) {}
}

export class AddSectionTagsAction {
  static readonly type = 'SECTION_TAGS:ADD';
  constructor(
    public siteName: string,
    public tags: SectionTagsInterface[],
  ) {}
}

export class AddSiteSectionsTagsAction {
  static readonly type = 'SITE_SECTIONS_TAGS:ADD';
  constructor(
    public site: SiteStateModel,
    public tags: SectionTagsInterface[],
  ) {}
}

export class RenameSectionTagsAction {
  static readonly type = 'SECTION_TAGS:RENAME';
  constructor(
    public siteName: string,
    public section: SiteSectionStateModel,
    public newSectionName: string,
  ) {}
}

export class DeleteSectionTagsAction {
  static readonly type = 'SECTION_TAGS:DELETE';
  constructor(public section: SiteSectionStateModel) {}
}

export class DeleteSiteSectionsTagsAction {
  static readonly type = 'SITE_SECTIONS_TAGS:DELETE';
  constructor(public siteName: string) {}
}

export class RenameSectionTagsSitenameAction {
  static readonly type = 'SITE_SECTIONS_TAGS_SITENAME:RENAME';
  constructor(
    public site: SiteStateModel,
    public siteName: string,
  ) {}
}

export class SwapContentsSitesTagsAction {
  static readonly type = 'SITE_SECTIONS_TAGS:SWAP';
  constructor(public payload: { siteSlugFrom: string; siteSlugTo: string }) {}
}

export class ResetSiteSectionsTagsAction {
  static readonly type = 'SITE_SECTIONS_TAGS:RESET';
}

export class InitSiteSectionsTagsAction {
  static readonly type = 'SITE_SECTIONS_TAGS:INIT';
  constructor(public payload: SectionTagsStateModel) {}
}

export class OrderSectionTagsFromSyncAction {
  static readonly type = 'SECTION_TAGS:ORDER:SYNC';
  constructor(
    public site: string,
    public section: string,
    public tag: string,
    public value: string,
  ) {}
}
