import { StateContext } from '@ngxs/store';

import { SiteSectionsState } from './sections-state/site-sections.state';
import { ReplaceSiteSectionsAction } from './sections-state/site-sections.actions';
import { SiteSectionStateModel } from './sections-state/site-sections-state.model';
import { SectionEntriesState } from './entries/entries-state/section-entries.state';
import { ReplaceSectionEntriesAction } from './entries/entries-state/section-entries.actions';
import { SectionEntriesStateModel } from './entries/entries-state/section-entries-state.model';

/** A context over a plain value, as NGXS gives a state's action handlers. */
function contextOf<T>(initial: T): {
  context: StateContext<T>;
  value: () => T;
} {
  let value = initial;

  return {
    context: {
      getState: () => value,
      setState: (next: T) => (value = next),
      patchState: (patch: Partial<T>) => (value = { ...value, ...patch }),
    } as unknown as StateContext<T>,
    value: () => value,
  };
}

describe('replacing store data with fresh data from the server', () => {
  it("replaces one site's sections, giving each a type, and keeps the other sites' sections", () => {
    const other = {
      name: 'news',
      site_name: 'archive',
    } as SiteSectionStateModel;
    const { context, value } = contextOf<SiteSectionStateModel[]>([
      { name: 'works', site_name: '' } as SiteSectionStateModel,
      other,
    ]);
    const state = new SiteSectionsState(
      undefined as any,
      undefined as any,
      undefined as any,
      undefined as any,
    );

    state.replaceSiteSections(
      context,
      new ReplaceSiteSectionsAction('', [
        { name: 'prints', site_name: '' } as SiteSectionStateModel,
      ]),
    );

    expect(value()).toEqual([
      other,
      {
        name: 'prints',
        site_name: '',
        '@attributes': { type: 'default' },
      } as any,
    ]);
  });

  it('replaces the entries of the given sections and drops those of sections that are gone', () => {
    const { context, value } = contextOf<SectionEntriesStateModel>({
      '': [
        { id: '1', sectionName: 'works' },
        { id: '2', sectionName: 'news' },
        { id: '3', sectionName: 'old' },
      ] as any,
      archive: [{ id: '9', sectionName: 'works' }] as any,
    });
    const state = new SectionEntriesState(
      undefined as any,
      undefined as any,
      undefined as any,
    );

    state.replaceSectionEntries(
      context,
      new ReplaceSectionEntriesAction(
        '',
        { works: [{ id: '4', sectionName: 'works' }] as any },
        ['works', 'news'],
      ),
    );

    expect(value()[''].map((entry) => entry.id)).toEqual(['2', '4']);
    expect(value()['archive'].map((entry) => entry.id)).toEqual(['9']);
  });
});
