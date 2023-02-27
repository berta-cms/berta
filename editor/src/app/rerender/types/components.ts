export interface SiteSettingChildrenHandler {
  socialMediaComp: Component[];
  banners: Component;
  settings: Component;
  entryLayout: Component;
}

export interface Component {
  id: string;
  dataKey: string;
}
