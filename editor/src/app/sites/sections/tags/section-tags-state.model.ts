export interface SectionTagsStateModel {
  [siteName: string]: {
    section: SectionTagsInterface[];
  };
}

export interface SectionTagsInterface {
  tags: any[];
  '@attributes': { [k: string]: string };
}
