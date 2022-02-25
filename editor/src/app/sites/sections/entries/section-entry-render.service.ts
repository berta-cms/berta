import { Injectable } from '@angular/core';
import { toHtmlAttributes } from '../../../../app/shared/helpers';
import * as EntryTemplate from '../../../../templates/Sites/Sections/Entries/entry.twig';
import * as EntryContents from '../../../../templates/Sites/Sections/Entries/_entryContents.twig';
import { SiteSectionStateModel } from '../sections-state/site-sections-state.model';
import { SectionEntry } from './entries-state/section-entries-state.model';
import { GalleryColumnRenderService } from './galleries/gallery-column-render.service';
import { GalleryPileRenderService } from './galleries/gallery-pile-render.service';
import { GalleryRowRenderService } from './galleries/gallery-row-render.service';
import { GallerySlideshowRenderService } from './galleries/gallery-slideshow-render.service';

@Injectable({
  providedIn: 'root',
})
export class SectionEntryRenderService {
  constructor(
    private gallerySlideshowRenderService: GallerySlideshowRenderService,
    private galleryRowRenderService: GalleryRowRenderService,
    private galleryColumnRenderService: GalleryColumnRenderService,
    private galleryPileRenderService: GalleryPileRenderService
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
    appState,
    siteSettings,
    siteSlug: string,
    entry: SectionEntry,
    templateName: string,
    currentSection: SiteSectionStateModel,
    currentSectionType: string,
    siteTemplateSettings,
    isResponsive: boolean
  ) {
    const apiPath = `${siteSlug}/entry/${currentSection.name}/${entry.id}/`;

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
        // galleryLinkRenderService;
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

    let entryContents = EntryContents({
      ...entry,
      ...{
        galleryPosition: siteTemplateSettings.entryLayout.galleryPosition
          ? siteTemplateSettings.entryLayout.galleryPosition
          : currentSectionType === 'portfolio'
          ? 'after text wrap'
          : 'above title',
        gallery: gallery,
      },
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
    appState,
    siteSettings,
    siteSlug: string,
    entry: SectionEntry,
    templateName: string,
    currentSection: SiteSectionStateModel,
    currentSectionType: string,
    siteTemplateSettings,
    isResponsive: boolean
  ) {
    const viewData = this.getViewData(
      appState,
      siteSettings,
      siteSlug,
      entry,
      templateName,
      currentSection,
      currentSectionType,
      siteTemplateSettings,
      isResponsive
    );
    const htmlOutput = EntryTemplate(viewData);

    return htmlOutput;
  }
}
