import { SiteStateModel } from '../../../sites-state/site-state.model';
import { SiteSectionStateModel } from '../../sections-state/site-sections-state.model';
import {
  SectionEntry,
  SectionEntriesStateModel,
} from './section-entries-state.model';

export class AddSectionEntryFromSyncAction {
  static readonly type = 'SECTION_ENTRY:ADD:SYNC';
  constructor(
    public site: string,
    public section: string,
    public payload: {
      tag: string;
      before_entry: string;
    }
  ) {}
}

export class MoveSectionEntryFromSyncAction {
  static readonly type = 'SECTION_ENTRY:MOVE:SYNC';
  constructor(
    public site: string,
    public currentSection: string,
    public entryId: string,
    public toSection: string
  ) {}
}

export class AddSectionEntriesAction {
  static readonly type = 'SECTION_ENTRIES:ADD';
  constructor(public siteName: string, public entries: SectionEntry[]) {}
}

export class AddSiteEntriesAction {
  static readonly type = 'SITE_SECTIONS_ENTRIES:ADD';
  constructor(public site: SiteStateModel, public entries: SectionEntry[]) {}
}

export class DeleteSectionEntriesAction {
  static readonly type = 'SECTION_ENTRIES:DELETE';
  constructor(public section: SiteSectionStateModel) {}
}

export class DeleteSiteSectionsEntriesAction {
  static readonly type = 'SITE_SECTIONS_ENTRIES:DELETE';
  constructor(public siteName: string) {}
}

export class RenameSectionEntriesAction {
  static readonly type = 'SECTION_ENTRIES:RENAME';
  constructor(
    public siteName: string,
    public section: SiteSectionStateModel,
    public newSectionName: string
  ) {}
}

export class RenameSectionEntriesSitenameAction {
  static readonly type = 'SITE_SECTIONS_ENTRIES_SITENAME:RENAME';
  constructor(public site: SiteStateModel, public siteName: string) {}
}

export class ResetSectionEntriesAction {
  static readonly type = 'SECTION_ENTRIES:RESET';
}

export class InitSectionEntriesAction {
  static readonly type = 'SECTION_ENTRIES:INIT';
  constructor(public payload: SectionEntriesStateModel) {}
}

export class UpdateSectionEntryFromSyncAction {
  static readonly type = 'SECTION_ENTRY:UPDATE:SYNC';
  constructor(public path: string, public payload: any, public nOfReq = 0) {}
}

export class UpdateSectionEntryAction {
  static readonly type = 'SECTION_ENTRY:UPDATE';
  constructor(public path: string, public payload: any) {}
}

export class OrderSectionEntriesFromSyncAction {
  static readonly type = 'SECTION_ENTRIES:ORDER:SYNC';
  constructor(
    public site: string,
    public section: string,
    public entryId: string,
    public value: string
  ) {}
}

export class DeleteSectionEntryFromSyncAction {
  static readonly type = 'SECTION_ENTRY:DELETE:SYNC';
  constructor(
    public site: string,
    public section: string,
    public entryId: string
  ) {}
}

export class DeleteSectionLastEntry {
  static readonly type = 'SECTION_LAST_ENTRY:DELETE';
  constructor(public section: string) {}
}

export class UpdateEntryGalleryFromSyncAction {
  static readonly type = 'SECTION_ENTRY_GALLERY:UPDATE:SYNC';
  constructor(
    public site: string,
    public section: string,
    public entryId: string,
    public files: string[]
  ) {}
}

export class AddEntryGalleryFileAction {
  static readonly type = 'SECTION_ENTRY_GALLERY:ADD_FILE';
  constructor(
    public site: string,
    public section: string,
    public entryId: string,
    public file: File
  ) {}
}

export class UpdateEntryGalleryFileAction {
  static readonly type = 'SECTION_ENTRY_GALLERY:UPDATE_FILE';
  constructor(public path: string, public payload: any) {}
}

export class UpdateEntryGalleryVideoPosterAction {
  static readonly type = 'SECTION_ENTRY_GALLERY:UPDATE_VIDEO_POSTER';
  constructor(
    public site: string,
    public section: string,
    public entryId: string,
    public fileName: string,
    public payload: File
  ) {}
}

export class UpdateEntryGalleryImageCropAction {
  static readonly type = 'SECTION_ENTRY_GALLERY:IMAGE_CROP';
  constructor(
    public site: string,
    public section: string,
    public entryId: string,
    public fileOrder: string,
    public payload: {
      x: number;
      y: number;
      width: number;
      height: number;
    }
  ) {}
}

export class DeleteEntryGalleryFileAction {
  static readonly type = 'SECTION_ENTRY_GALLERY:DELETE_FILE';
  constructor(
    public site: string,
    public section: string,
    public entryId: string,
    public file: string
  ) {}
}

export class OrderEntryGalleryFilesAction {
  static readonly type = 'SECTION_ENTRY_GALLERY:ORDER';
  constructor(
    public site: string,
    public section: string,
    public entryId: string,
    public files: string[]
  ) {}
}
