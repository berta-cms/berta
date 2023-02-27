import { Injectable } from '@angular/core';
import { shuffleArray, toHtmlAttributes } from 'src/app/shared/helpers';
import * as Template from '../../../../templates/Sites/Sections/Entries/mashupEntries.twig';
import { SiteSectionStateModel } from '../sections-state/site-sections-state.model';
import { SectionEntry } from './entries-state/section-entries-state.model';
import { GalleryRenderService } from './galleries/gallery-render.service';

@Injectable({
  providedIn: 'root',
})
export class MashupEntriesRenderService {
  USED_IN_TEMPLATES = ['mashup'];

  constructor(public galleryRenderService: GalleryRenderService) {}

  getContent(
    siteSlug: string,
    entry: SectionEntry,
    siteSettings,
    siteTemplateSettings,
    isRandom: boolean
  ) {
    if (
      !entry.mediaCacheData ||
      !entry.mediaCacheData.file ||
      entry.mediaCacheData.file.length < 1
    ) {
      return {
        content:
          entry.content && entry.content.description
            ? entry.content.description
            : '',
        url: null,
        galleryItem: null,
      };
    }

    const items = [...entry.mediaCacheData.file];

    if (isRandom) {
      shuffleArray(items);
    }

    const item = items[0];

    let galleryItem = this.galleryRenderService.getGalleryItem(
      siteSlug,
      item,
      entry,
      siteSettings
    );

    const imageSizeRatio = parseFloat(
      siteTemplateSettings.firstPage.imageSizeRatio
    );

    if (imageSizeRatio > 0) {
      galleryItem = {
        ...galleryItem,
        ...{
          width: galleryItem.width
            ? galleryItem.width * imageSizeRatio
            : galleryItem.width,
          height: galleryItem.height
            ? galleryItem.height * imageSizeRatio
            : galleryItem.height,
        },
      };
    }

    return {
      url: null,
      galleryItem: galleryItem,
    };
  }

  getStyles(entry: SectionEntry, contentItem, isResponsive: boolean) {
    if (isResponsive) {
      return null;
    }

    const width = contentItem.galleryItem.width
      ? contentItem.galleryItem.width
      : 0;
    const height = contentItem.galleryItem.height
      ? contentItem.galleryItem.height
      : 0;

    const viewportWidth = 980;
    const viewportHeight = 800;

    const [left, top] =
      entry.content && entry.content.positionXY
        ? entry.content.positionXY.split(',')
        : [
            Math.floor(Math.random() * (viewportWidth - width) + 1),
            Math.floor(Math.random() * (viewportHeight - height) + 1),
          ];

    return `left:${left}px;top:${top}px`;
  }

  getAttributes(
    entry: SectionEntry,
    contentItem,
    siteSlug: string,
    siteTemplateSettings,
    isResponsive: boolean
  ) {
    let classes = [
      'firstPagePic',
      'xEntry',
      `xEntryId-${entry.id}`,
      `xSection-${entry.sectionName}`,
    ];

    if (entry.content && entry.content.fixed === '1') {
      classes.push('xFixed');
    }

    if (siteTemplateSettings.firstPage.hoverWiggle === 'yes') {
      classes.push('firstPageWiggle');
    }

    if (!isResponsive) {
      classes = [...classes, ...['xEditableDragXY', 'xProperty-positionXY']];
    }

    return toHtmlAttributes({
      class: classes.join(' '),
      style: this.getStyles(entry, contentItem, isResponsive),
      'data-path': !isResponsive
        ? `${siteSlug}/entry/${entry.sectionName}/${entry.id}/content/positionXY`
        : null,
    });
  }

  // Get marked entries from all sections
  getEntries(
    siteSlug: string,
    entries: SectionEntry[],
    currentSection: SiteSectionStateModel,
    siteTemplateSectionTypes,
    siteSettings,
    siteTemplateSettings
  ) {
    const order = currentSection.marked_items_imageselect
      ? currentSection.marked_items_imageselect
      : siteTemplateSectionTypes.mash_up.params.marked_items_imageselect
          .default;
    const isRandom = order === 'random';

    let mashupEntries = entries.filter(
      (entry) =>
        entry.sectionName !== currentSection.name && entry.marked === '1'
    );

    if (isRandom) {
      shuffleArray(mashupEntries);
    }

    const markedItemsCount = currentSection.marked_items_count
      ? currentSection.marked_items_count
      : siteTemplateSectionTypes.mash_up.params.marked_items_count.default;

    const isResponsive = siteTemplateSettings.pageLayout.responsive === 'yes';

    mashupEntries = mashupEntries
      .slice(0, parseInt(markedItemsCount, 10))
      .map((entry) => {
        const contentItem = this.getContent(
          siteSlug,
          entry,
          siteSettings,
          siteTemplateSettings,
          isRandom
        );
        return {
          ...entry,
          ...{
            item: contentItem,
            attributes: this.getAttributes(
              entry,
              contentItem,
              siteSlug,
              siteTemplateSettings,
              isResponsive
            ),
          },
        };
      });

    return mashupEntries;
  }

  getWrapperAttributes(
    siteTemplateSettings,
    currentSection: SiteSectionStateModel,
    tagSlug: string
  ) {
    let classes = [
      'xEntriesList',
      `xSection-${currentSection.name}`,
      `xTag-${tagSlug}`,
      'xNoEntryOrdering',
    ];

    const columnCount = parseInt(
      siteTemplateSettings.pageLayout.mashUpColumns,
      10
    );
    if (columnCount > 1) {
      classes.push(`columns-${columnCount}`);
    }

    return toHtmlAttributes({
      id: 'firstPageMarkedEntries',
      class: classes.join(' '),
    });
  }

  getViewData(
    siteSlug: string,
    currentSection: SiteSectionStateModel,
    siteSettings,
    siteTemplateSettings,
    siteTemplateSectionTypes,
    entries: SectionEntry[],
    tagSlug: string
  ) {
    return {
      entries: this.getEntries(
        siteSlug,
        entries,
        currentSection,
        siteTemplateSectionTypes,
        siteSettings,
        siteTemplateSettings
      ),
      wrapperAttributes: this.getWrapperAttributes(
        siteTemplateSettings,
        currentSection,
        tagSlug
      ),
      isEditMode: true,
    };
  }

  render(
    siteSlug: string,
    templateName: string,
    currentSection: SiteSectionStateModel,
    currentSectionType: string,
    siteSettings,
    siteTemplateSettings,
    siteTemplateSectionTypes,
    entries: SectionEntry[],
    tagSlug: string
  ) {
    if (
      !this.USED_IN_TEMPLATES.includes(templateName) ||
      currentSectionType !== 'mash_up'
    ) {
      return '';
    }

    const viewData = this.getViewData(
      siteSlug,
      currentSection,
      siteSettings,
      siteTemplateSettings,
      siteTemplateSectionTypes,
      entries,
      tagSlug
    );
    const htmlOutput = Template(viewData);

    return htmlOutput;
  }
}
