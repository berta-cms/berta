import { Injectable } from '@angular/core';
import { AppStateModel } from '../../../app/app-state/app-state.interface';
import { getCookie } from '../../../app/shared/helpers';
import * as Template from '../../../templates/Sites/Sections/gridView.twig';
import { SiteSectionStateModel } from './sections-state/site-sections-state.model';

@Injectable({
  providedIn: 'root',
})
export class GridViewRenderService {
  USED_IN_TEMPLATES = ['messy'];

  getUrl(
    siteSlug: string,
    currentSection: SiteSectionStateModel,
    tagSlug: string
  ) {
    let urlParts: string[] = [];

    if (siteSlug) {
      urlParts.push(`site=${siteSlug}`);
    }

    urlParts.push(`section=${currentSection.name}`);

    if (tagSlug) {
      urlParts.push(`tag=${tagSlug}`);
    }

    return `/engine/editor/?${urlParts.join('&')}`;
  }

  getImageItems(
    appState: AppStateModel,
    siteSlug: string,
    currentSection: SiteSectionStateModel,
    tagSlug: string
  ) {
    const items = currentSection.mediaCacheData.file.map((image) => {
      return {
        ...image,
        ...{
          url: this.getUrl(siteSlug, currentSection, tagSlug),
          src: `/storage/${siteSlug.length ? `-sites/${siteSlug}/` : ''}media/${
            currentSection.mediafolder
          }/${appState.gridImagePrefix}${image['@attributes'].src}`,
        },
      };
    });

    return items;
  }

  getViewData(
    appState: AppStateModel,
    siteSlug: string,
    currentSection: SiteSectionStateModel,
    tagSlug: string
  ) {
    const items = this.getImageItems(
      appState,
      siteSlug,
      currentSection,
      tagSlug
    );

    return { items: items };
  }

  render(
    appState: AppStateModel,
    siteSlug: string,
    templateName: string,
    currentSection: SiteSectionStateModel,
    currentSectionType: string,
    tagSlug: string
  ) {
    if (
      !this.USED_IN_TEMPLATES.includes(templateName) ||
      !currentSection ||
      !currentSection.mediaCacheData ||
      !currentSection.mediaCacheData.file ||
      currentSection.mediaCacheData.file.length < 1 ||
      currentSectionType !== 'grid' ||
      !!getCookie('_berta_grid_view')
    ) {
      return '';
    }

    const viewData = this.getViewData(
      appState,
      siteSlug,
      currentSection,
      tagSlug
    );

    const htmlOutput = Template(viewData);

    return htmlOutput;
  }
}
