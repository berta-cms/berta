export interface SiteSettingChildrenHandler {
  socialMediaComp: Component[];
  banners: Component;
  settings: Component;
  entryLayout: Component;
  siteTexts: Component;
}

export interface Component {
  id: string;
  dataKey: string;
}
