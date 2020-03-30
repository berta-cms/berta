import { SettingsGroupModel } from '../../shared/interfaces';

export interface SitesTemplateSettingsStateModel {
  [siteName: string]: TemplateSettingsSiteModel;
}

export interface TemplateSettingsSiteModel {
  default?: SettingsGroupModel[];
  'mashup-0.3.5'?: SettingsGroupModel[];
  'messy-0.4.2'?: SettingsGroupModel[];
  'white-0.3.5'?: SettingsGroupModel[];
}

/* Response */
export interface SitesTemplateSettingsResponse {
  [siteName: string]: SitesTemplateSettingsSiteResponse;
}

export interface SitesTemplateSettingsSiteResponse {
  default?: TemplateSettingsTemplateResponse;
  'mashup-0.3.5'?: TemplateSettingsTemplateResponse;
  'messy-0.4.2'?: TemplateSettingsTemplateResponse;
  'white-0.3.5'?: TemplateSettingsTemplateResponse;
}

export type FontFamilyDf =
  | 'Arial, sans-serif'
  | 'Helvetica, Arial, sans-serif'
  | '"Helvetica Neue", Helvetica, Arial, sans-serif'
  | '"Arial Black", Gadget, sans-serif'
  | '"Comic Sans MS", cursive'
  | '"Courier New", Courier, monospace'
  | 'Georgia, "Times New Roman", Times, serif'
  | 'Impact, Charcoal, sans-serif'
  | '"Lucida Console", Monaco, monospace'
  | '"Lucida Sans Unicode", "Lucida Grande", sans-serif'
  | '"Palatino Linotype", "Book Antiqua", Palatino, serif'
  | 'Tahoma, Geneva, sans-serif'
  | '"Times New Roman", Times, serif'
  | '"Trebuchet MS", Helvetica, sans-serif'
  | 'Verdana, Geneva, sans-serif';
export type CssUnitDf = string | number;
export type FontStyleDf = 'normal' | 'italic' | 'oblique' | 'inherit';
export type FontVariantDf = 'small-caps' | 'inherit' | 'normal';
export type FontWeightDf = 'normal' | 'bold' | 'bolder' | 'light' | 'lighter' | 'inherit';
export type TextDecorationDf = 'none' | 'underline' | 'overline' | 'line-through';

export interface TemplateSettingsTemplateResponse {
  background?: {
    backgroundAttachment?: 'fixed' | 'fill' | 'scroll';
    backgroundColor?: string;
    backgroundImage_height?: number;
    backgroundImage_width?: number;
    backgroundImage?: string;
    backgroundImageEnabled?: 'yes' | 'no';
    backgroundPosition?:
      | 'top left'
      | 'top center'
      | 'top right'
      | 'center left'
      | 'center'
      | 'center right'
      | 'bottom left'
      | 'bottom center'
      | 'bottom right';
    backgroundRepeat?: 'repeat' | 'repeat-x' | 'repeat-y' | 'no-repeat';
  };
  css?: {
    customCSS?: string;
  };
  entryFooter?: {
    color?: string;
    fontFamily?: FontFamilyDf;
    fontSize?: CssUnitDf;
    fontStyle?: FontStyleDf;
    fontVariant?: FontVariantDf;
    fontWeight?: FontWeightDf;
    googleFont?: string;
    lineHeight?: CssUnitDf;
  };
  entryHeading?: {
    color?: string;
    fontFamily?: FontFamilyDf;
    fontSize?: CssUnitDf;
    fontStyle?: FontStyleDf;
    fontVariant?: FontVariantDf;
    fontWeight?: FontWeightDf;
    googleFont?: string;
    lineHeight?: CssUnitDf;
    margin?: CssUnitDf;
  };
  entryLayout?: {
    contentWidth?: CssUnitDf;
    defaultGalleryType?: 'slideshow' | 'row';
    galleryMargin?: string | number;
    galleryNavMargin?: string | number;
    galleryPosition?: 'between title/description' | 'above title' | 'below description';
    margin?: CssUnitDf;
    spaceBetween?: CssUnitDf;
    spaceBetweenImages?: CssUnitDf;
  };
  firstPage?: {
    hoverWiggle?: 'yes' | 'no';
    imageHaveShadows?: 'yes' | 'no';
    imageSizeRatio?: number;
  };
  generalFontSettings?: {
    color?: string;
    fontFamily?: FontFamilyDf;
    fontSize?: CssUnitDf;
    fontStyle?: FontStyleDf;
    fontVariant?: FontVariantDf;
    fontWeight?: FontWeightDf;
    googleFont?: string;
    lineHeight?: CssUnitDf;
  };
  grid?: {
    contentWidth?: CssUnitDf;
  };
  heading?: {
    color?: string;
    fontFamily?: FontFamilyDf;
    fontSize?: CssUnitDf;
    fontStyle?: FontStyleDf;
    fontVariant?: FontVariantDf;
    fontWeight?: FontWeightDf;
    googleFont?: string;
    image_height?: number;
    image_width?: number;
    image?: string;
    lineHeight?: CssUnitDf;
    position?: 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky';
  };
  links?: {
    colorLink?: string;
    colorVisited?: string;
    colorHover?: string;
    colorActive?: string;
    textDecorationLink?: TextDecorationDf;
    textDecorationVisited?: TextDecorationDf;
    textDecorationHover?: TextDecorationDf;
    textDecorationActive?: TextDecorationDf;
  };
  menu?: {
    colorActive?: string;
    colorHover?: string;
    colorLink?: string;
    fontFamily?: FontFamilyDf;
    fontSize?: CssUnitDf;
    fontStyle?: FontStyleDf;
    fontVariant?: FontVariantDf;
    fontWeight?: FontWeightDf;
    googleFont?: string;
    lineHeight?: CssUnitDf;
    margin?: CssUnitDf;
    position?: CssUnitDf;
    separator?: string;
    separatorDistance?: CssUnitDf;
    textDecorationActive?: TextDecorationDf;
    textDecorationHover?: TextDecorationDf;
    textDecorationLink?: TextDecorationDf;
  };
  pageHeading?: {
    color?: string;
    fontFamily?: FontFamilyDf;
    fontSize?: CssUnitDf;
    fontStyle?: FontStyleDf;
    fontVariant?: FontVariantDf;
    fontWeight?: FontWeightDf;
    googleFont?: string;
    image?: string;
    image_height?: number;
    image_width?: number;
    lineHeight?: string;
    margin?: CssUnitDf;
    marginBottom?: string;
    marginTop?: string;
  };
  pageLayout?: {
    bgButtonType?: string;
    bodyMargin?: string;
    centered?: string;
    centeredContents?: string;
    centeredWidth?: CssUnitDf;
    centeringGuidesColor?: string;
    contentAlign?: 'left' | 'right' | 'justify-left' | 'justify-right';
    contentPosition?: 'left' | 'center' | 'right';
    contentWidth?: CssUnitDf;
    headingMargin?: string;
    leftColumnWidth?: CssUnitDf;
    mashUpColumns?: number;
    menuMargin?: string;
    paddingLeft?: CssUnitDf;
    paddingTop?: CssUnitDf;
    responsive?: 'no' | 'yes';
    siteMenuMargin?: CssUnitDf;
  };
  sideBar?: {
    backgroundColor?: string;
    color?: string;
    fontFamily?: FontFamilyDf;
    fontSize?: CssUnitDf;
    fontStyle?: FontStyleDf;
    fontVariant?: FontVariantDf;
    fontWeight?: FontWeightDf;
    googleFont?: string;
    image?: string;
    image_height?: number;
    image_width?: number;
    lineHeight?: CssUnitDf;
    marginBottom?: CssUnitDf;
    marginLeft?: CssUnitDf;
    marginTop?: CssUnitDf;
    transparent?: 'yes' | 'no';
    width?: CssUnitDf;
  };
  subMenu?: {
    fontFamily?: FontFamilyDf;
    fontSize?: CssUnitDf;
    fontStyle?: FontStyleDf;
    fontVariant?: FontVariantDf;
    fontWeight?: FontWeightDf;
    googleFont?: string;
    lineHeight?: CssUnitDf;
    margin?: CssUnitDf;
    separator?: string;
    separatorDistance?: CssUnitDf;
  };
  tagsMenu?: {
    fontFamily?: FontFamilyDf;
    googleFont?: string;
    fontSize?: CssUnitDf;
    fontWeight?: FontWeightDf;
    fontStyle?: FontStyleDf;
    lineHeight?: CssUnitDf;
    colorLink?: string;
    colorHover?: string;
    colorActive?: string;
    textDecorationLink?: TextDecorationDf;
    textDecorationHover?: TextDecorationDf;
    textDecorationActive?: TextDecorationDf;
    x?: number;
    y?: number;
    alwaysOpen?: 'yes' | 'no';
    hidden?: 'yes' | 'no';
  };
}
