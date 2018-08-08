export class UpdateSiteSectionAction {
  static readonly type = 'SITE_SECTION:UPDATE';
  constructor(public siteName: string,
              public order: number,
              public payload: {[k: string]: any}) {
  }
}

export class DeleteSiteSectionsAction {
  static readonly type = 'SITE_SECTIONS:DELETE';
  constructor(public siteName: string) {
  }
}
