import { Injectable } from '@angular/core';
import { UserStateModel } from 'src/app/user/user.state.model';
import { toHtmlAttributes } from '../../../../app/shared/helpers';
import * as EntryTemplate from '../../../../templates/Sites/Sections/Entries/entry.twig';
import * as EntryContents from '../../../../templates/Sites/Sections/Entries/_entryContents.twig';
import * as EntryTitle from '../../../../templates/Sites/Sections/Entries/_entryTitle.twig';
import * as EntryEditor from '../../../../templates/Sites/Sections/Entries/_entryEditor.twig';
import * as CartTitle from '../../../../templates/Sites/Sections/Entries/shop/_cartTitle.twig';
import * as AddToCart from '../../../../templates/Sites/Sections/Entries/shop/_addToCart.twig';
import * as ProductAttributesEditor from '../../../../templates/Sites/Sections/Entries/shop/_productAttributesEditor.twig';
import { SiteSectionStateModel } from '../sections-state/site-sections-state.model';
import { SectionEntry } from './entries-state/section-entries-state.model';
import { GalleryColumnRenderService } from './galleries/gallery-column-render.service';
import { GalleryLinkRenderService } from './galleries/gallery-link-render.service';
import { GalleryPileRenderService } from './galleries/gallery-pile-render.service';
import { GalleryRowRenderService } from './galleries/gallery-row-render.service';
import { GallerySlideshowRenderService } from './galleries/gallery-slideshow-render.service';
import { join } from 'lodash';

@Injectable({
  providedIn: 'root',
})
export class SectionEntryRenderService {
  constructor(
    private gallerySlideshowRenderService: GallerySlideshowRenderService,
    private galleryRowRenderService: GalleryRowRenderService,
    private galleryColumnRenderService: GalleryColumnRenderService,
    private galleryPileRenderService: GalleryPileRenderService,
    private galleryLinkRenderService: GalleryLinkRenderService
  ) {}

  getClassList(
    entry: SectionEntry,
    currentSection: SiteSectionStateModel,
    templateName: string,
    currentSectionType: string,
    isResponsive: boolean
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
    currentSectionType: string
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

      // @TODO get shop settings from state here

      // } else if (currentSectionType === 'shop' && siteSettings.shop.entryWidth) {
      //   const width = parseInt(siteSettings.shop.entryWidth, 10);
      //   if (width > 0) {
      //     styles.push(`width:${width}px`);
      //   }
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
    isResponsive: boolean
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
          false
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
          false
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
          false
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
          false
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
          false
        );
        break;
    }

    if (currentSectionType === 'portfolio' || templateName === 'default') {
      entryTitle = EntryTitle({
        ...entry,
        ...{
          attributes: {
            title: toHtmlAttributes({
              'data-path': `${apiPath}content/title`,
            }),
          },
        },
      });
    }

    if (user.features.includes('shop') && currentSectionType === 'shop') {
      entryTitle = CartTitle({
        ...entry,
        ...{
          attributes: {
            cartTitle: toHtmlAttributes({
              'data-path': `${apiPath}content/cartTitle`,
            }),
          },
        },
      });

      // @todo - get shop state
      addToCart = AddToCart({
        ...entry,
        ...{
          isEditMode: true,
          attributes: {
            cartPrice: toHtmlAttributes({
              'data-path': `${apiPath}content/cartPrice`,
            }),
          },
          // cartPriceFormatted: '...',
          // cartAttributes: '...'
          // ...
        },
      });

      productAttributesEditor = ProductAttributesEditor({
        apiPath: apiPath,
        cartAttributesEdit:
          entry.content && entry.content.cartAttributes
            ? entry.content.cartAttributes
            : '',
        // @todo - get shop state
        weightUnits: '...', // shopSettings.weightUnit
        entryWeight:
          entry.content && entry.content.weight ? entry.content.weight : '',
      });
    }

    let entryContents = EntryContents({
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
    });

    entryContents = EntryEditor({
      // Sections list for moving entry to other section
      // Exclude current section, external link and shopping cart
      sections: sections.filter((section) => {
        return (
          currentSection.name !== section.name &&
          !(
            section['@attributes'] &&
            section['@attributes'].type &&
            ['external_link', 'shopping_cart'].includes(
              section['@attributes'].type
            )
          )
        );
      }),
      templateName: templateName,
      tagList: entry.tags && entry.tags.tag ? entry.tags.tag.join(', ') : '',
      apiPath: apiPath,
      entryFixed:
        entry.content && entry.content.fixed ? entry.content.fixed : '0',
      entryWidth:
        entry.content && entry.content.width ? entry.content.width : '',
      entryMarked: entry.marked ? entry.marked : '0',
      productAttributesEditor: productAttributesEditor,
      entryContents: entryContents,
    });

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
            isResponsive
          ),
          style: this.getStyleList(
            entry,
            templateName,
            isResponsive,
            currentSectionType
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
    isResponsive: boolean
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
      isResponsive
    );
    const htmlOutput = EntryTemplate(viewData);

    return htmlOutput;
  }
}
