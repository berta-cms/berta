import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { of } from 'rxjs';

import { AppState } from '../app-state/app.state';
import { PreviewService } from '../preview/preview.service';
import {
  CreateSiteSettingsAction,
  DeleteSiteSettingsAction,
  HandleSiteSettingsChildrenChangesAction,
} from '../sites/settings/site-settings.actions';
import {
  CreateSiteTemplateSettingsAction,
  HandleSiteTemplateSettingsAction,
} from '../sites/template-settings/site-template-settings.actions';
import { ReplaceSiteSectionsAction } from '../sites/sections/sections-state/site-sections.actions';
import { ReplaceSectionEntriesAction } from '../sites/sections/entries/entries-state/section-entries.actions';
import {
  InitSitesAction,
  SiteContentRefreshedAction,
} from '../sites/sites-state/sites.actions';
import { AiChangesMirrorService } from './ai-changes-mirror.service';
import { AiChange, AiRefresh } from './ai-assistant.service';

describe('AiChangesMirrorService', () => {
  let dispatched: object[];
  let reloadIframe: jasmine.Spy;
  let navigate: jasmine.Spy;
  let currentSite: string;
  let mirror: AiChangesMirrorService;

  function change(
    kind: string,
    items: { group: string; key: string; value: string }[],
    subsite = '',
  ): AiChange {
    return {
      change_id: '1',
      tool: 'tool',
      subsite,
      kind,
      action: 'update',
      items: items.map((item) => ({ ...item, previous: '' })),
    };
  }

  function run(changes: AiChange[], refresh: AiRefresh) {
    mirror.mirror(changes, refresh).subscribe();
  }

  function dispatchedOf<T extends object>(
    type: new (...args: any[]) => T,
  ): T[] {
    return dispatched.filter((action): action is T => action instanceof type);
  }

  beforeEach(() => {
    dispatched = [];
    currentSite = '';
    reloadIframe = jasmine.createSpy('reloadIframe');
    navigate = jasmine.createSpy('navigate');
    const store = {
      dispatch: (actions: object | object[]) => {
        dispatched.push(...(Array.isArray(actions) ? actions : [actions]));
        return of(null);
      },
      selectSnapshot: (selector: unknown) =>
        selector === AppState.getSite
          ? currentSite
          : [{ name: '' }, { name: 'archive' }],
    } as unknown as Store;

    mirror = new AiChangesMirrorService(
      store,
      { reloadIframe } as unknown as PreviewService,
      { navigate } as unknown as Router,
    );
  });

  it('does nothing for a reply without changes', () => {
    run([], { site_data: {} });

    expect(dispatched).toEqual([]);
  });

  it('swaps the fresh parts into the store, then re-renders the content', () => {
    const sections = [{ name: 'works', site_name: '' }] as any;
    const entries = { works: [{ id: '1', sectionName: 'works' }] } as any;

    run([change('entry', [{ group: 'works', key: '1.title', value: 'One' }])], {
      site_data: { '': { sections, entries } },
    });

    const replacedSections = dispatchedOf(ReplaceSiteSectionsAction)[0];
    const replacedEntries = dispatchedOf(ReplaceSectionEntriesAction)[0];

    expect(replacedSections.sections).toBe(sections);
    expect(replacedEntries.entriesBySection).toBe(entries);
    expect(replacedEntries.sectionNames).toEqual(['works']);
    expect(dispatched[dispatched.length - 1]).toEqual(
      new SiteContentRefreshedAction(''),
    );
    expect(reloadIframe).not.toHaveBeenCalled();
  });

  it('re-renders settings and design with the triggers the editor uses for its own edits', () => {
    run(
      [
        change('settings', [
          { group: 'siteTexts', key: 'siteHeading', value: 'Studio' },
        ]),
        change('design', [
          { group: 'heading', key: 'color', value: '#f00' },
          { group: 'background', key: 'backgroundColor', value: '#fff' },
        ]),
      ],
      {
        site_data: {
          '': { settings: {} as any, template_settings: {} as any },
        },
      },
    );

    expect(dispatchedOf(CreateSiteSettingsAction).length).toBe(1);
    expect(dispatchedOf(CreateSiteTemplateSettingsAction).length).toBe(1);
    expect(dispatchedOf(HandleSiteSettingsChildrenChangesAction)).toEqual([
      new HandleSiteSettingsChildrenChangesAction('siteTexts', {
        siteHeading: 'Studio',
      }),
    ]);
    // Styles follow the store: only groups the templates re-render get a trigger.
    expect(dispatchedOf(HandleSiteTemplateSettingsAction)).toEqual([
      new HandleSiteTemplateSettingsAction('heading', { color: '#f00' }),
    ]);
    expect(dispatchedOf(SiteContentRefreshedAction)).toEqual([]);
  });

  it('reloads the preview where the editor reloads it for its own edits', () => {
    run(
      [
        change('section', [
          { group: 'works', key: 'type', value: 'portfolio' },
        ]),
      ],
      {
        site_data: { '': { sections: [] } },
      },
    );

    expect(reloadIframe).toHaveBeenCalled();
  });

  it('leaves the preview of another site alone', () => {
    run(
      [
        change(
          'settings',
          [{ group: 'siteTexts', key: 'siteHeading', value: 'x' }],
          'archive',
        ),
      ],
      {
        site_data: { archive: { settings: {} as any } },
      },
    );

    expect(dispatchedOf(CreateSiteSettingsAction).length).toBe(1);
    expect(dispatchedOf(HandleSiteSettingsChildrenChangesAction)).toEqual([]);
  });

  it('drops the data of a deleted subsite, and opens the main site when it was open', () => {
    currentSite = 'archive';

    run(
      [
        change('subsite', [
          { group: 'archive', key: 'subsite', value: 'deleted' },
        ]),
      ],
      {
        sites: [{ name: '' }] as any,
        site_data: {},
      },
    );

    expect(dispatchedOf(DeleteSiteSettingsAction)).toEqual([
      new DeleteSiteSettingsAction('archive'),
    ]);
    expect(dispatchedOf(InitSitesAction).length).toBe(1);
    expect(navigate).toHaveBeenCalledWith([], {
      queryParams: { site: null },
      queryParamsHandling: 'merge',
    });
  });
});
