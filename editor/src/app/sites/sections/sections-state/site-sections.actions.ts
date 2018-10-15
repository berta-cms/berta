import { SiteStateModel } from '../../sites-state/site-state.model';
import { SiteSectionStateModel } from '../sections-state/site-sections-state.model';

export class CreateSectionAction {
  static readonly type = 'SITE_SECTION:CREATE';
  constructor(public section?: SiteSectionStateModel) {
  }
}

export class AddSiteSectionsAction {
  static readonly type = 'SITE_SECTIONS:ADD';
  constructor(public sections: SiteSectionStateModel[]) {
  }
}

export class UpdateSiteSectionAction {
  static readonly type = 'SITE_SECTION:UPDATE';
  constructor(public section: SiteSectionStateModel,
              public order: number,
              public payload: {[k: string]: any}) {
  }
}

export class UpdateSiteSectionFromSyncAction {
  static readonly type = 'SITE_SECTION:UPDATE:SYNC';
  constructor(public path: string,
              public payload: any) {
  }
}

export class DeleteSiteSectionBackgroundFromSyncAction {
  static readonly type = 'SITE_SECTION_BACKGROUND:DELETE:SYNC';
  constructor(public site: string,
              public section: string,
              public file: string) {
  }
}

export class UpdateSiteSectionBackgroundFromSyncAction {
  static readonly type = 'SITE_SECTION_BACKGROUND:UPDATE:SYNC';
  constructor(public site: string,
              public section: string,
              public files: string[]) {
  }
}

export class RenameSiteSectionAction {
  static readonly type = 'SITE_SECTION:RENAME';
  constructor(public section: SiteSectionStateModel,
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

export class CloneSectionAction {
  static readonly type = 'SITE_SECTION:CLONE';
  constructor(public section: SiteSectionStateModel) {
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

export class ResetSiteSectionsAction {
  static readonly type = 'SITE_SECTIONS:RESET';
}

export class InitSiteSectionsAction {
  static readonly type = 'SITE_SECTIONS:INIT';
  constructor(public payload: SiteSectionStateModel[]) {}
}
