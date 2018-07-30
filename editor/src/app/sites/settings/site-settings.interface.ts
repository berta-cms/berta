export interface SitesSettingsStateModel {
  [siteName: string]: SiteSettingsModel;
}

export interface SiteSettingsModel {
  template?: {
    template?: string;
  };
  siteTexts?: {
    siteHeading?: string;
    siteFooter?: string;
    tourComplete?: number;
    multisitesXY?: string;
    additionalTextXY?: string;
    additionalText?: string;
    siteHeadingXY?: string;
    banner1XY?: string;
    banner2XY?: string;
    banner3XY?: string;
    banner4XY?: string;
    banner5XY?: string;
    banner6XY?: string;
    banner7XY?: string;
    banner8XY?: string;
    banner9XY?: string;
    banner10XY?: string;
  };
  berta?: {
    lastUpdated?: string;
    installed?: number;
  };
  texts?: {
    ownerName?: string;
    pageTitle?: string;
    metaKeywords?: string;
    metaDescription?: string;
  };
  settings?: {
    showTutorialVideos?: string;
    hideBertaCopyright?: string;
    googleAnalyticsId?: string;
    googleSiteVerification?: string;
    flashUploadEnabled?: string;
    jsInclude?: string;
  };
  entryLayout?: {
    galleryFullScreenCaptionAlign?: string;
    galleryFullScreenDefault?: string;
    galleryFullScreenBackground?: string;
    galleryFullScreenFrame?: string;
    galleryFullScreenCloseText?: string;
    galleryFullScreenImageNumbers?: string;
    gallerySlideshowAutoRewind?: string;
    gallerySlideNumberVisibilityDefault?: string;
  };
  media?: {
    imagesSmallWidth?: number;
    imagesSmallHeight?: number;
    imagesMediumWidth?: number;
    imagesMediumHeight?: number;
    imagesLargeWidth?: number;
    imagesLargeHeight?: number;
  };
  banners?: {
    banner1_image?: string;
    banner1_image_width?: number;
    banner1_image_height?: number;
    banner1_link?: string;
    banner2_image?: string;
    banner2_image_width?: number;
    banner2_image_height?: number;
    banner2_link?: string;
    banner3_image?: string;
    banner3_image_width?: number;
    banner3_image_height?: number;
    banner3_link?: string;
    banner4_image?: string;
    banner4_image_width?: number;
    banner4_image_height?: number;
    banner4_link?: string;
    banner5_image?: string;
    banner5_image_width?: number;
    banner5_image_height?: number;
    banner5_link?: string;
    banner6_image?: string;
    banner6_image_width?: number;
    banner6_image_height?: number;
    banner6_link?: string;
    banner7_image?: string;
    banner7_image_width?: number;
    banner7_image_height?: number;
    banner7_link?: string;
    banner8_image?: string;
    banner8_image_width?: number;
    banner8_image_height?: number;
    banner8_link?: string;
    banner9_image?: string;
    banner9_image_width?: number;
    banner9_image_height?: number;
    banner9_link?: string;
    banner10_image?: string;
    banner10_image_width?: number;
    banner10_image_height?: number;
    banner10_link?: string;
  };
  navigation?: {
    landingSectionVisible?: string;
    landingSectionPageHeadingVisible?: string;
    landingSectionMenuVisible?: string;
    alwaysSelectTag?: string;
  };
  pageLayout?: {
    favicon?: string;
    gridStep?: number;
    showGrid?: string;
    gridColor?: string;
  };
  socialMediaButtons?: {
    socialMediaHTML?: string;
    socialMediaJS?: string;
    socialMediaLocation?: string;
  };
  language?: {
    language?: string;
  };
}

export interface SiteSettingsConfigStateModel {
  [settingGroupName: string]: SiteSettingsConfigGroup;
}

export interface SiteSettingsConfigGroup {
  _: SiteSettingsSectionMeta;
  [settingName: string]: SiteSettingsConfigSetting;
}

export interface SiteSettingsSectionMeta extends SiteSettingsConfigSetting {
  title: string;
  invisible?: boolean;
}

export interface SiteSettingsConfigSetting {
  value: any;
  default: any;
  format: string;
  title?: string;
  [k: string]: any;
}
