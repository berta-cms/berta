import { Injectable } from '@angular/core';
import { toHtmlAttributes } from 'src/app/shared/helpers';
import * as Template from '../../../../templates/Sites/Sections/Entries/entry.twig';
import { SiteSectionStateModel } from '../sections-state/site-sections-state.model';
import { SectionEntry } from './entries-state/section-entries-state.model';

@Injectable({
  providedIn: 'root',
})
export class SectionEntryRenderService {
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
    siteSlug: string,
    entry: SectionEntry,
    templateName: string,
    currentSection: SiteSectionStateModel,
    currentSectionType: string,
    siteTemplateSettings,
    isResponsive: boolean
  ) {
    const apiPath = `${siteSlug}/entry/${currentSection.name}/${entry.id}/`;

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
    };
  }

  render(
    siteSlug: string,
    entry: SectionEntry,
    templateName: string,
    currentSection: SiteSectionStateModel,
    currentSectionType: string,
    siteTemplateSettings,
    isResponsive: boolean
  ) {
    const viewData = this.getViewData(
      siteSlug,
      entry,
      templateName,
      currentSection,
      currentSectionType,
      siteTemplateSettings,
      isResponsive
    );
    const htmlOutput = Template(viewData);

    return htmlOutput;
  }
}
