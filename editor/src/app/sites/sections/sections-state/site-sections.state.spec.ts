import { TestBed } from '@angular/core/testing';
import { Actions, StateContext, Store } from '@ngxs/store';
import { of } from 'rxjs';

import { SiteSectionsState } from './site-sections.state';
import { SiteSectionStateModel } from './site-sections-state.model';
import { RenameSiteSectionAction } from './site-sections.actions';
import { AppState } from '../../../app-state/app.state';
import { AppStateService } from '../../../app-state/app-state.service';
import { UpdateAppStateAction } from '../../../app-state/app.actions';
import { FileUploadService } from '../../shared/file-upload.service';

describe('SiteSectionsState', () => {
  const SECTIONS = [
    { name: 'untitled-1', title: '', order: 0, site_name: '' },
    { name: 'about', title: 'About', order: 1, site_name: '' },
  ] as SiteSectionStateModel[];

  let dispatch: jasmine.Spy;

  const rename = (currentSection: string, section: SiteSectionStateModel) => {
    dispatch = jasmine.createSpy('dispatch');
    const sync = jasmine
      .createSpy('sync')
      .and.returnValue(of({ section: { title: 'News', name: 'news' } }));
    const store = {
      selectSnapshot: (selector: unknown) =>
        selector === AppState.getSite
          ? ''
          : selector === AppState.getSection
            ? currentSection
            : null,
    } as unknown as Store;
    const state = TestBed.runInInjectionContext(
      () =>
        new SiteSectionsState(
          { sync } as unknown as AppStateService,
          {} as Actions,
          store,
          {} as FileUploadService,
        ),
    );
    const context = {
      getState: () => SECTIONS,
      setState: jasmine.createSpy('setState'),
      dispatch,
    } as unknown as StateContext<SiteSectionStateModel[]>;

    state
      .renameSiteSection(
        context,
        new RenameSiteSectionAction(section, section.order, { title: 'News' }),
      )
      .subscribe();
  };

  const appStateUpdates = () =>
    dispatch.calls
      .allArgs()
      .map(([action]) => action)
      .filter((action) => action instanceof UpdateAppStateAction);

  it('moves the current section to its new name when it is renamed', () => {
    rename('untitled-1', SECTIONS[0]);

    expect(appStateUpdates().map((action) => action.payload)).toEqual([
      { section: 'news' },
    ]);
  });

  it('keeps the current section when another section is renamed', () => {
    rename('about', SECTIONS[0]);

    expect(appStateUpdates()).toEqual([]);
  });
});
