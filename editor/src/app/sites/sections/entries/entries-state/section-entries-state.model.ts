export interface SectionEntriesStateModel {
  [siteName: string]: SectionEntry[];
}

export interface SectionEntry {
  sectionName: string;
  [k: string]: any;
}
