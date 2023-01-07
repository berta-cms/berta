export interface SiteSettingChildrenHandler {
  socialMediaComp: Component[]
  media: Component
  banners: Component
  settings: Component
}

export interface Component {
  id: string
  dataKey: string
}
