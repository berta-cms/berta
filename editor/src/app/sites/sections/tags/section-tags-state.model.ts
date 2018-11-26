export interface SectionTagsStateModel {
  [siteName: string]: {
    section: SectionTagsInterface[];
  };
}

export interface SectionTagsInterface {
  tag: any[];
  '@attributes': { [k: string]: string };
}
