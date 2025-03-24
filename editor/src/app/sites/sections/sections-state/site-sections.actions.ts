import { SiteStateModel } from '../../sites-state/site-state.model';
import { SiteSectionStateModel } from '../sections-state/site-sections-state.model';

export class CreateSectionAction {
  static readonly type = 'SITE_SECTION:CREATE';
  constructor(public section?: SiteSectionStateModel) {}
}

export class AddSiteSectionAction {
  static readonly type = 'SITE_SECTION:ADD';
  constructor(public section: SiteSectionStateModel) {}
}

export class AddSiteSectionsAction {
  static readonly type = 'SITE_SECTIONS:ADD';
  constructor(public sections: SiteSectionStateModel[]) {}
}

export class UpdateSiteSectionAction {
  static readonly type = 'SITE_SECTION:UPDATE';
  constructor(
    public site: string,
    public order: number,
    public payload: { [k: string]: any }
  ) {}
}

export class UpdateSiteSectionFromSyncAction {
  static readonly type = 'SITE_SECTION:UPDATE:SYNC';
  constructor(public path: string, public payload: any) {}
}

export class UpdateSiteSectionByPathAction {
  static readonly type = 'SITE_SECTION:UPDATE_BY_PATH';
  constructor(public path: string, public payload: string) {}
}

export class UpdateSiteSectionBackgroundFromSyncAction {
  static readonly type = 'SITE_SECTION_BACKGROUND:UPDATE:SYNC';
  constructor(
    public site: string,
    public section: string,
    public files: string[]
  ) {}
}

export class OrderSiteSectionBackgroundAction {
  static readonly type = 'SITE_SECTION_BACKGROUND:ORDER';
  constructor(
    public site: string,
    public section: string,
    public files: string[]
  ) {}
}

export class DeleteSiteSectionBackgroundFileAction {
  static readonly type = 'SITE_SECTION_BACKGROUND:DELETE_FILE';
  constructor(
    public site: string,
    public section: string,
    public file: string
  ) {}
}

export class AddSiteSectionBackgroundFileAction {
  static readonly type = 'SITE_SECTION_BACKGROUND:ADD_FILE';
  constructor(public site: string, public section: string, public file: File) {}
}

export class UpdateSectionBackgroundFileAction {
  static readonly type = 'SITE_SECTION_BACKGROUND:UPDATE_FILE';
  constructor(public path: string, public payload: string) {}
}

export class RenameSiteSectionAction {
  static readonly type = 'SITE_SECTION:RENAME';
  constructor(
    public section: SiteSectionStateModel,
    public order: number,
    public payload: { [k: string]: any }
  ) {}
}

export class RenameSiteSectionsSitenameAction {
  static readonly type = 'SITE_SECTIONS_SITENAME:RENAME';
  constructor(public site: SiteStateModel, public siteName: string) {}
}

export class CloneSectionAction {
  static readonly type = 'SITE_SECTION:CLONE';
  constructor(public section: SiteSectionStateModel) {}
}

export class DeleteSiteSectionAction {
  static readonly type = 'SITE_SECTION:DELETE';
  constructor(public section: SiteSectionStateModel) {}
}

export class ReOrderSiteSectionsAction {
  static readonly type = 'SITE_SECTIONS:REORDER';
  constructor(public currentOrder: number, public payload: number) {}
}

export class DeleteSiteSectionsAction {
  static readonly type = 'SITE_SECTIONS:DELETE';
  constructor(public siteName: string) {}
}

export class ResetSiteSectionsAction {
  static readonly type = 'SITE_SECTIONS:RESET';
}

export class InitSiteSectionsAction {
  static readonly type = 'SITE_SECTIONS:INIT';
  constructor(public payload: SiteSectionStateModel[]) {}
}
