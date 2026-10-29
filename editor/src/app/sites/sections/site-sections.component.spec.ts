import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { Store } from '@ngxs/store';
import { BehaviorSubject, of } from 'rxjs';

import { AppState } from '../../app-state/app.state';
import { InlineTextInputComponent } from '../../inputs/inline-text-input.component';
import { PopupService } from '../../popup/popup.service';
import { AutofocusDirective } from '../shared/autofocus.directive';
import { SiteTemplateSettingsState } from '../template-settings/site-template-settings.state';
import { SiteTemplatesState } from '../template-settings/site-templates.state';
import { SectionComponent } from './section.component';
import { SiteSectionStateModel } from './sections-state/site-sections-state.model';
import {
  CloneSectionAction,
  CreateSectionAction,
} from './sections-state/site-sections.actions';
import { SiteSectionsState } from './sections-state/site-sections.state';
import { SiteSectionsComponent } from './site-sections.component';

describe('SiteSectionsComponent', () => {
  let harness: RouterTestingHarness;
  let sections$: BehaviorSubject<SiteSectionStateModel[]>;

  const section = (name: string, order: number): SiteSectionStateModel =>
    ({
      name,
      title: name,
      order,
      site_name: '',
      '@attributes': { type: 'default', published: '1' },
    }) as SiteSectionStateModel;

  /** New sections are added at the end of the list */
  const lastSectionTitleInput = () =>
    harness.routeNativeElement.querySelector<HTMLInputElement>(
      'berta-section:last-of-type h3 input',
    );

  /** Waits for the navigation, the render after it and the focus timers */
  const settle = async () => {
    for (let i = 0; i < 3; i++) {
      await harness.fixture.whenStable();
      harness.detectChanges();
    }
  };

  beforeEach(async () => {
    sections$ = new BehaviorSubject([section('home', 0), section('work', 1)]);

    const addSection = (name: string) => {
      sections$.next([
        ...sections$.value,
        section(name, sections$.value.length),
      ]);
      return of(undefined);
    };

    const store = {
      select: (selector: unknown) => {
        if (selector === SiteSectionsState.getCurrentSiteSections) {
          return sections$;
        }
        if (selector === SiteTemplatesState.getCurrentTemplateSectionTypes) {
          return of({ default: { title: 'Default', params: {} } });
        }
        if (selector === SiteTemplateSettingsState.getIsResponsive) {
          return of(false);
        }
        return of({});
      },
      selectSnapshot: (selector: unknown) => {
        if (selector === AppState.getSite) {
          return '';
        }
        return (selector as (state: unknown) => unknown)({
          siteSections: sections$.value,
        });
      },
      dispatch: (action: unknown) => {
        if (action instanceof CreateSectionAction) {
          return addSection('untitled-1');
        }
        if (action instanceof CloneSectionAction) {
          return addSection(`clone-of-${action.section.name}`);
        }
        return of(undefined);
      },
    } as unknown as Store;

    await TestBed.configureTestingModule({
      declarations: [
        SiteSectionsComponent,
        SectionComponent,
        InlineTextInputComponent,
        AutofocusDirective,
      ],
      providers: [
        provideRouter([
          { path: 'sections/:section', component: SiteSectionsComponent },
          { path: 'sections', component: SiteSectionsComponent },
        ]),
        { provide: Store, useValue: store },
        { provide: PopupService, useValue: {} },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    harness = await RouterTestingHarness.create();
    document.body.appendChild(harness.fixture.nativeElement);
  });

  afterEach(() => {
    harness.fixture.nativeElement.remove();
  });

  it('opens a created section and puts the cursor in its title', async () => {
    await harness.navigateByUrl('/sections?site=');

    harness.routeNativeElement
      .querySelector<HTMLButtonElement>(':scope > button')
      .click();
    await settle();

    expect(TestBed.inject(Router).url).toBe(
      '/sections/untitled-1?site=&section=untitled-1',
    );
    const input = lastSectionTitleInput();
    expect(input).toBeTruthy();
    expect(input.placeholder).toBe('Section title');
    expect(document.activeElement).toBe(input);
  });

  it('opens a copied section and puts the cursor in its title', async () => {
    await harness.navigateByUrl('/sections/home?section=home');

    harness.routeNativeElement
      .querySelector<HTMLButtonElement>('berta-section button[title="copy"]')
      .click();
    await settle();

    expect(TestBed.inject(Router).url).toBe(
      '/sections/clone-of-home?section=clone-of-home',
    );
    const input = lastSectionTitleInput();
    expect(input).toBeTruthy();
    expect(input.value).toBe('clone-of-home');
    expect(document.activeElement).toBe(input);
  });
});
