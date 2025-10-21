import { Injectable } from '@angular/core';
import { UserStateModel } from '../../../user/user.state.model';
import {
  formatPrice,
  toCartAttributes,
  toHtmlAttributes,
} from '../../../../app/shared/helpers';
import { SiteSectionStateModel } from '../sections-state/site-sections-state.model';
import { SectionEntry } from './entries-state/section-entries-state.model';
import { GalleryColumnRenderService } from './galleries/gallery-column-render.service';
import { GalleryLinkRenderService } from './galleries/gallery-link-render.service';
import { GalleryPileRenderService } from './galleries/gallery-pile-render.service';
import { GalleryRowRenderService } from './galleries/gallery-row-render.service';
import { GallerySlideshowRenderService } from './galleries/gallery-slideshow-render.service';
import { TwigTemplateRenderService } from '../../../render/twig-template-render.service';

@Injectable({
  providedIn: 'root',
})
export class SectionEntryRenderService {
  constructor(
    private gallerySlideshowRenderService: GallerySlideshowRenderService,
    private galleryRowRenderService: GalleryRowRenderService,
    private galleryColumnRenderService: GalleryColumnRenderService,
    private galleryPileRenderService: GalleryPileRenderService,
    private galleryLinkRenderService: GalleryLinkRenderService,
    private twigTemplateRenderService: TwigTemplateRenderService,
  ) {}

  getClassList(
    entry: SectionEntry,
    currentSection: SiteSectionStateModel,
    templateName: string,
    currentSectionType: string,
    isResponsive: boolean,
  ): string {
    let classes: string[] = [
      'entry',
      'xEntry',
      'clearfix',
      `xEntryId-${entry.id}`,
      `xSection-${currentSection.name}`,
    ];

    if (templateName === 'messy') {
      classes.push('xShopMessyEntry');

      if (!isResponsive) {
        classes = [
          ...classes,
          ...['mess', 'xEditableDragXY', 'xProperty-positionXY'],
        ];
      }
    }

    if (entry.content && entry.content.fixed && entry.content.fixed === '1') {
      classes.push('xFixed');
    }

    if (currentSectionType === 'portfolio') {
      classes.push('xHidden');
    }

    return classes.join(' ');
  }

  getStyleList(
    entry: SectionEntry,
    templateName: string,
    isResponsive: boolean,
    currentSectionType: string,
    shopSettings,
  ): string {
    if (templateName !== 'messy' || isResponsive) {
      return '';
    }
    let styles = [];

    const placeInFullScreen = entry.updated;
    const [left, top] =
      entry.content && entry.content.positionXY
        ? entry.content.positionXY.split(',')
        : [
            (placeInFullScreen ? 0 : 900) +
              Math.floor(Math.random() * (placeInFullScreen ? 960 : 60) + 1),
            (placeInFullScreen ? 0 : 30) +
              Math.floor(Math.random() * (placeInFullScreen ? 600 : 170) + 1),
          ];

    styles.push(`left:${left}px;top:${top}px`);

    if (entry.content && entry.content.width) {
      styles.push(`width:${entry.content.width}px`);
    } else if (
      currentSectionType === 'shop' &&
      shopSettings.group_price_item &&
      shopSettings.group_price_item.entryWidth
    ) {
      const width = parseInt(shopSettings.group_price_item.entryWidth, 10);
      if (width > 0) {
        styles.push(`width:${width}px`);
      }
    }

    return styles.join(';');
  }

  getViewData(
    user: UserStateModel,
    appState,
    siteSettings,
    siteSlug: string,
    entry: SectionEntry,
    templateName: string,
    sections: SiteSectionStateModel[],
    currentSection: SiteSectionStateModel,
    currentSectionType: string,
    siteTemplateSettings,
    isResponsive: boolean,
    shopSettings,
  ) {
    const apiPath = `${siteSlug}/entry/${currentSection.name}/${entry.id}/`;
    let entryTitle, addToCart, productAttributesEditor;

    const galleryType =
      entry.mediaCacheData &&
      entry.mediaCacheData['@attributes'] &&
      entry.mediaCacheData['@attributes'].type
        ? entry.mediaCacheData['@attributes'].type
        : siteTemplateSettings.entryLayout.defaultGalleryType;

    let gallery;

    switch (galleryType) {
      case 'row':
        gallery = this.galleryRowRenderService.render(
          appState,
          siteSlug,
          siteSettings,
          templateName,
          entry,
          siteTemplateSettings,
          true,
          false,
        );
        break;

      case 'column':
        gallery = this.galleryColumnRenderService.render(
          appState,
          siteSlug,
          siteSettings,
          templateName,
          entry,
          siteTemplateSettings,
          true,
          false,
        );
        break;

      case 'pile':
        gallery = this.galleryPileRenderService.render(
          appState,
          siteSlug,
          siteSettings,
          templateName,
          entry,
          siteTemplateSettings,
          true,
          false,
        );
        break;

      case 'link':
        gallery = this.galleryLinkRenderService.render(
          appState,
          siteSlug,
          siteSettings,
          templateName,
          entry,
          siteTemplateSettings,
          true,
          false,
        );
        break;

      default:
        gallery = this.gallerySlideshowRenderService.render(
          appState,
          siteSlug,
          siteSettings,
          templateName,
          entry,
          siteTemplateSettings,
          true,
          false,
        );
        break;
    }

    if (currentSectionType === 'portfolio' || templateName === 'default') {
      try {
        entryTitle = this.twigTemplateRenderService.render(
          'Sites/Sections/Entries/_entryTitle',
          {
            ...entry,
            ...{
              attributes: {
                title: toHtmlAttributes({
                  'data-path': `${apiPath}content/title`,
                }),
              },
            },
          },
        );
      } catch (error) {
        console.error('Failed to render template:', error);
        entryTitle = '';
      }
    }

    if (user.features.includes('shop') && currentSectionType === 'shop') {
      try {
        entryTitle = this.twigTemplateRenderService.render(
          'Sites/Sections/Entries/shop/_cartTitle',
          {
            ...entry,
            ...{
              attributes: {
                cartTitle: toHtmlAttributes({
                  'data-path': `${apiPath}content/cartTitle`,
                }),
              },
            },
          },
        );
      } catch (error) {
        console.error('Failed to render template:', error);
        entryTitle = '';
      }

      try {
        addToCart = this.twigTemplateRenderService.render(
          'Sites/Sections/Entries/shop/_addToCart',
          {
            ...entry,
            ...{
              isEditMode: true,
              attributes: {
                cartPrice: toHtmlAttributes({
                  'data-path': `${apiPath}content/cartPrice`,
                }),
              },
              cartPriceFormatted:
                entry.content && entry.content.cartPrice
                  ? formatPrice(
                      entry.content.cartPrice,
                      shopSettings.group_config.currency,
                    )
                  : '',
              cartAttributes:
                entry.content && entry.content.cartAttributes
                  ? toCartAttributes(entry.content.cartAttributes)
                  : '',
              addToBasketLabel: shopSettings.group_config.addToBasket,
              addedToBasketText: shopSettings.group_config.addedToBasket,
              outOfStockText: shopSettings.group_config.outOfStock,
            },
          },
        );
      } catch (error) {
        console.error('Failed to render template:', error);
        addToCart = '';
      }

      try {
        productAttributesEditor = this.twigTemplateRenderService.render(
          'Sites/Sections/Entries/shop/_productAttributesEditor',
          {
            apiPath: apiPath,
            cartAttributesEdit:
              entry.content && entry.content.cartAttributes
                ? entry.content.cartAttributes
                : '',
            weightUnits: shopSettings.group_config.weightUnit,
            entryWeight:
              entry.content && entry.content.weight ? entry.content.weight : '',
          },
        );
      } catch (error) {
        console.error('Failed to render template:', error);
        productAttributesEditor = '';
      }
    }

    let entryContents = '';

    try {
      entryContents = this.twigTemplateRenderService.render(
        'Sites/Sections/Entries/_entryContents',
        {
          ...entry,
          ...{
            galleryPosition: siteTemplateSettings.entryLayout.galleryPosition
              ? siteTemplateSettings.entryLayout.galleryPosition
              : currentSectionType === 'portfolio'
                ? 'after text wrap'
                : 'above title',
            gallery: gallery,
            templateName: templateName,
            galleryType: galleryType,
            entryTitle: entryTitle ? entryTitle : '',
            showDescription: true,
            attributes: {
              description: toHtmlAttributes({
                'data-path': `${apiPath}content/description`,
              }),
              url: toHtmlAttributes({
                'data-path': `${apiPath}content/url`,
              }),
            },
            showUrl: templateName === 'default',
            isEditMode: true,
            addToCart: addToCart ? addToCart : '',
          },
        },
      );
    } catch (error) {
      console.error('Failed to render template:', error);
      entryContents = '';
    }

    try {
      entryContents = this.twigTemplateRenderService.render(
        'Sites/Sections/Entries/_entryEditor',
        {
          // Sections list for moving entry to other section
          // Exclude current section, external link and shopping cart
          sections: sections.filter((section) => {
            return (
              currentSection.name !== section.name &&
              !(
                section['@attributes'] &&
                section['@attributes'].type &&
                ['external_link', 'shopping_cart'].includes(
                  section['@attributes'].type,
                )
              )
            );
          }),
          templateName: templateName,
          tagList:
            entry.tags && entry.tags.tag ? entry.tags.tag.join(', ') : '',
          apiPath: apiPath,
          entryFixed:
            entry.content && entry.content.fixed ? entry.content.fixed : '0',
          entryWidth:
            entry.content && entry.content.width ? entry.content.width : '',
          entryMarked: entry.marked ? entry.marked : '0',
          productAttributesEditor: productAttributesEditor,
          entryContents: entryContents,
        },
      );
    } catch (error) {
      console.error('Failed to render template:', error);
      entryContents = '';
    }

    return {
      entryHTMLTag: templateName === 'messy' ? 'div' : 'li',
      entryId: `entry-${entry.id}`,
      attributes: {
        entry: toHtmlAttributes({
          class: this.getClassList(
            entry,
            currentSection,
            templateName,
            currentSectionType,
            isResponsive,
          ),
          style: this.getStyleList(
            entry,
            templateName,
            isResponsive,
            currentSectionType,
            shopSettings,
          ),
          'data-path':
            templateName == 'messy' && !isResponsive
              ? `${apiPath}content/positionXY`
              : '',
        }),
      },
      entryContents: entryContents,
      // gallery: '...', <--- no need for this variable, it is generated only serverside at the moment
    };
  }

  render(
    user: UserStateModel,
    appState,
    siteSettings,
    siteSlug: string,
    entry: SectionEntry,
    templateName: string,
    sections: SiteSectionStateModel[],
    currentSection: SiteSectionStateModel,
    currentSectionType: string,
    siteTemplateSettings,
    isResponsive: boolean,
    shopSettings,
  ) {
    const viewData = this.getViewData(
      user,
      appState,
      siteSettings,
      siteSlug,
      entry,
      templateName,
      sections,
      currentSection,
      currentSectionType,
      siteTemplateSettings,
      isResponsive,
      shopSettings,
    );

    try {
      return this.twigTemplateRenderService.render(
        'Sites/Sections/Entries/entry',
        viewData,
      );
    } catch (error) {
      console.error('Failed to render template:', error);
      return '';
    }
  }
}
