export class DeleteSiteSectionsTagsAction {
  static readonly type = 'SITE_SECTIONS_TAGS:DELETE';
  constructor(public siteName: string) {
  }
}
