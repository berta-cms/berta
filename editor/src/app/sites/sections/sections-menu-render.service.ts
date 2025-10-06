import { Injectable } from '@angular/core';
import { toHtmlAttributes } from '../../shared/helpers';
import { SectionRenderService } from './section-render.service';
import { SiteSectionStateModel } from './sections-state/site-sections-state.model';
import { TwigTemplateRenderService } from '../../render/twig-template-render.service';

@Injectable({
  providedIn: 'root',
})
export class SectionsMenuRenderService {
  DRAGGABLE_MENU_CLASSES = ['mess', 'xEditableDragXY', 'xProperty-positionXY'];

  constructor(
    public sectionRenderService: SectionRenderService,
    public twigTemplateRenderService: TwigTemplateRenderService
  ) {}

  getSectionClassList(
    section: SiteSectionStateModel,
    currentSection,
    templateName: string,
    siteTemplateSettings,
    isResponsive: boolean
  ): string {
    let classes: string[] = [];

    if (currentSection && section.name === currentSection.name) {
      classes.push('selected');
    }

    if (templateName === 'messy') {
      classes.push(`xSection-${section.name}`);

      if (siteTemplateSettings.menu.position === 'fixed') {
        classes.push('xFixed');
      } else {
        const i = classes.indexOf('xFixed');
        if (i > -1) {
          classes.splice(i, 1);
        }
      }

      if (!isResponsive) {
        classes = [...classes, ...this.DRAGGABLE_MENU_CLASSES];
      }
    }

    return classes.join(' ');
  }

  getSectionStyleList(
    section: SiteSectionStateModel,
    isResponsive: boolean,
    templateName: string,
    siteTemplateSettings
  ): string {
    if (templateName !== 'messy' || isResponsive) {
      return '';
    }

    const [left, top] = section.positionXY
      ? section.positionXY.split(',')
      : [
          Math.floor(Math.random() * 960 + 1),
          Math.floor(Math.random() * 600 + 1),
        ];

    let position = 'absolute';
    if (siteTemplateSettings.menu.position === 'fixed') {
      position = 'fixed';
    }

    return `left:${left}px;top:${top}px;position:${position} !important;`;
  }

  getUrl(
    section: SiteSectionStateModel,
    siteSlug: string,
    tagSlug: string | null
  ): string {
    let urlParts = [];
    const isExternalLink =
      section['@attributes'] &&
      section['@attributes'].type &&
      section['@attributes'].type == 'external_link';
    if (isExternalLink && section.link) {
      return section.link;
    }

    if (siteSlug) {
      urlParts.push(`site=${siteSlug}`);
    }

    urlParts.push(`section=${section.name}`);

    if (tagSlug) {
      urlParts.push(`tag=${tagSlug}`);
    }

    return `/engine/editor/?${urlParts.join('&')}`;
  }

  getSubmenuItemClassList(
    section: SiteSectionStateModel,
    tag,
    currentSection,
    tagSlug
  ) {
    let classList = [`xTag-${tag['@attributes'].name}`];

    if (
      tag['@attributes'].name === tagSlug &&
      section.name === currentSection.name
    ) {
      classList.push('selected');
    }

    return classList.join(' ');
  }

  getTags(sectionTags) {
    return (
      sectionTags &&
      sectionTags.reduce((sections, section) => {
        sections[section['@attributes'].name] = section.tag;

        return sections;
      }, {})
    );
  }

  getSectionTags(
    siteSlug,
    tags,
    tagSlug,
    section: SiteSectionStateModel,
    currentSection,
    templateName,
    siteTemplateSettings,
    isResponsive
  ) {
    const sectionTags = tags ? tags[section.name] || [] : [];

    const filteredTags = sectionTags
      .filter((tag) => {
        switch (templateName) {
          case 'messy':
            if (siteTemplateSettings.tagsMenu.hidden === 'yes') {
              return false;
            }

            if (
              isResponsive &&
              siteTemplateSettings.tagsMenu.alwaysOpen !== 'yes' &&
              currentSection.name !== section.name
            ) {
              return false;
            }
            break;

          case 'white':
            if (currentSection.name !== section.name) {
              return false;
            }
            break;
        }

        // mashup template shows all submenus open
        // default template has separate submenu
        return true;
      })
      .sort((a, b) => a.order - b.order)
      .map((tag) => {
        return {
          name: tag['@attributes'].name,
          title: tag['@value'],
          attributes: toHtmlAttributes({
            class: this.getSubmenuItemClassList(
              section,
              tag,
              currentSection,
              tagSlug
            ),
          }),
          linkAttributes: toHtmlAttributes({
            class: 'handle',
            href: this.getUrl(section, siteSlug, tag['@attributes'].name),
          }),
        };
      });

    return filteredTags;
  }

  submenuAttributes(section: SiteSectionStateModel, sectionTags) {
    let classList = ['subMenu', `xSection-${section.name}`];

    if (sectionTags.length > 1) {
      classList.push('xAllowOrdering');
    }

    return toHtmlAttributes({
      class: classList.join(' '),
    });
  }

  getViewData(
    siteSlug,
    sections: SiteSectionStateModel[],
    sectionSlug,
    templateName,
    siteTemplateSettings,
    sectionTags,
    tagSlug: string | null
  ) {
    const currentSection = this.sectionRenderService.getCurrentSection(
      sections,
      sectionSlug
    );
    const isResponsiveTemplate =
      siteTemplateSettings.pageLayout.responsive === 'yes';
    const isResponsive = this.sectionRenderService.isResponsive(
      currentSection,
      siteTemplateSettings
    );

    const tags = this.getTags(sectionTags);

    let availableSections = sections.filter(
      (section) =>
        section.title.length > 0 &&
        !(
          section['@attributes'] &&
          section['@attributes'].type &&
          section['@attributes'].type === 'shopping_cart'
        )
    );

    let submenu = {};

    availableSections = availableSections.map((section) => {
      let sectionTags = this.getSectionTags(
        siteSlug,
        tags,
        tagSlug,
        section,
        currentSection,
        templateName,
        siteTemplateSettings,
        isResponsive
      );

      const submenuAttributes = this.submenuAttributes(section, sectionTags);

      if (templateName === 'default' && currentSection) {
        if (currentSection.name === section.name) {
          submenu = {
            tags: sectionTags,
            submenuAttributes: submenuAttributes,
          };
        }

        if (!isResponsiveTemplate) {
          sectionTags = [];
        }
      }

      return {
        ...section,
        ...{
          attributes: toHtmlAttributes({
            class: this.getSectionClassList(
              section,
              currentSection,
              templateName,
              siteTemplateSettings,
              isResponsive
            ),
            style: this.getSectionStyleList(
              section,
              isResponsive,
              templateName,
              siteTemplateSettings
            ),
            'data-path': !isResponsive
              ? `${siteSlug}/section/${section.order}/positionXY`
              : '',
          }),
          linkAttributes: toHtmlAttributes({
            href: this.getUrl(section, siteSlug, null),
            target:
              section['@attributes'] &&
              section['@attributes'].type &&
              section['@attributes'].type === 'external_link'
                ? section.target
                  ? section.target
                  : ''
                : '',
          }),
          tags: sectionTags,
          submenuAttributes: submenuAttributes,
        },
      };
    });

    return {
      sections: availableSections,
      submenu: submenu,
    };
  }

  render(
    siteSlug,
    sections,
    sectionSlug,
    templateName,
    siteTemplateSettings,
    sectionTags,
    tagSlug
  ) {
    if (!sections) {
      return '';
    }

    const viewData = this.getViewData(
      siteSlug,
      sections,
      sectionSlug,
      templateName,
      siteTemplateSettings,
      sectionTags,
      tagSlug
    );

    if (!viewData.sections || viewData.sections.length === 0) {
      return '';
    }

    try {
      return this.twigTemplateRenderService.render(
        'Sites/Sections/sectionsMenu',
        viewData
      );
    } catch (error) {
      console.error('Failed to render template:', error);
      return '';
    }
  }
}
