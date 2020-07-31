export interface SiteStateModel {
  name: string;
  title: string;
  order: number;
  mediaUrl: string;
  '@attributes': {
    published: 0 | 1;
  };
}
