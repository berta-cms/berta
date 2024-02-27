export interface SectionEntriesStateModel {
  [siteName: string]: SectionEntry[];
}

export interface SectionEntry {
  sectionName: string;
  marked?: string;
  mediaCacheData: SectionEntryGallery;
  [k: string]: any;
}

export interface SectionEntryGallery {
  file: SectionEntryGalleryFile[];
  [k: string]: any;
}

export interface SectionEntryGalleryFile {
  '@value': string;
  '@attributes': {
    type: string;
    src: string;
    width?: string;
    height?: string;
    autoplay?: string;
    poster_frame?: string;
  };
}
