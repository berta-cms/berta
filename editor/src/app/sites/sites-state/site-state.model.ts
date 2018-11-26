export interface SiteStateModel {
  name: string;
  title: string;
  order: number;
  '@attributes': {
    published: 0 | 1;
  };
}
