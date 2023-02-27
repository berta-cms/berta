export interface SectionEntriesStateModel {
  [siteName: string]: SectionEntry[];
}

export interface SectionEntry {
  sectionName: string;
  marked?: string;
  [k: string]: any;
}
