export interface SiteSectionStateModel {
  name: string;
  order: number;
  title: string;
  site_name: string;
  link?: string;
  target?: string;
  seoTitle?: string;
  seoKeywords?: string;
  seoDescription?: string;
  backgroundVideoEmbed?: string;
  positionXY?: string;
  mediafolder?: string;
  marked_items_imageselect?: string;
  marked_items_count?: string;
  columns?: string;
  sectionBgColor?: string;
  backgroundVideoRatio?: string;
  mediaCacheData?: {
    file?: {
      '@value': string;
      '@attributes': {
        type: string;
        src: string;
        width: number;
        height: number;
      };
    }[];
    '@attributes'?: {
      hide_navigation?: 'yes' | 'no';
      caption_bg_color?: string;
      caption_color?: string;
      autoplay?: 0 | 1;
      image_size?: string;
      animation?: string;
    };
  };
  '@attributes'?: {
    tags_behavior?: string;
    entry_count?: number;
    published?: 0 | 1;
    has_direct_content?: '0' | '1';
    type?: string;
  };
}
