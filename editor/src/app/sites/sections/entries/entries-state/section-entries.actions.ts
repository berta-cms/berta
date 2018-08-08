export class DeleteSiteSectionsEntriesAction {
  static readonly type = 'SITE_SECTIONS_ENTRIES:DELETE';
  constructor(public siteName: string) {
  }
}
