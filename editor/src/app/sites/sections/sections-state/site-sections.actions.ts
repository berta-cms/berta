export class UpdateSiteSection {
  static readonly type = 'SITE_SECTION:UPDATE';
  constructor(public siteName: string,
              public order: number,
              public payload: {[k: string]: any}) {
  }
}

export class DeleteSiteSections {
  static readonly type = 'SITE_SECTIONS:DELETE';
  constructor(public siteName: string) {
  }
}
