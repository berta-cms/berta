export interface SectionEntriesStateModel {
  [siteName: string]: SectionEntry[];
}

export interface SectionEntry {
  id: string;
  sectionName: string;
  marked?: string;
  mediaCacheData: SectionEntryGallery;
  [k: string]: any;
}

export interface SectionEntryGallery {
  file: SectionEntryGalleryFile[];
  '@attributes': {
    type: string;
    [k: string]: any;
  };
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
