import { SectionsMenuRenderService } from './sections-menu-render.service';
import { SectionRenderService } from './section-render.service';
import { TwigTemplateRenderService } from '../../render/twig-template-render.service';

describe('SectionsMenuRenderService', () => {
  let service: SectionsMenuRenderService;

  const sections: any[] = [
    { name: 'projects', title: 'Projects', order: 0, site_name: '' },
    { name: 'about', title: 'About', order: 1, site_name: '' },
  ];
  const sectionTags = [
    {
      '@attributes': { name: 'projects' },
      tag: [{ '@attributes': { name: 'tag-a' }, '@value': 'Tag A', order: 0 }],
    },
  ];
  const templateSettings = (responsive: string) => ({
    pageLayout: { responsive },
    menu: { position: 'absolute' },
    tagsMenu: { hidden: 'no', alwaysOpen: 'no' },
  });

  beforeEach(() => {
    service = new SectionsMenuRenderService(
      new SectionRenderService(null),
      null as unknown as TwigTemplateRenderService,
    );
  });

  // A renamed or deleted section stays in the app state's current section
  // until the route updates, so the menu can render with a slug that no
  // section has.
  for (const [templateName, responsive] of [
    ['white', 'no'],
    ['messy', 'yes'],
  ]) {
    it(`renders the ${templateName} menu when no section matches the current slug`, () => {
      const viewData: any = service.getViewData(
        '',
        sections,
        'renamed-away',
        templateName,
        templateSettings(responsive),
        sectionTags,
        'tag-a',
      );

      expect(viewData.sections.length).toBe(2);
      expect(viewData.sections[0].tags).toEqual([]);
    });
  }

  it('shows the current section tags in the white menu', () => {
    const viewData: any = service.getViewData(
      '',
      sections,
      'projects',
      'white',
      templateSettings('no'),
      sectionTags,
      'tag-a',
    );

    expect(viewData.sections[0].tags.map((tag: any) => tag.name)).toEqual([
      'tag-a',
    ]);
    expect(viewData.sections[0].tags[0].attributes).toContain('selected');
  });
});
