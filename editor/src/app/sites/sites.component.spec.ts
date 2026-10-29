import { Dialog } from '@angular/cdk/dialog';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { Store } from '@ngxs/store';
import { BehaviorSubject, of } from 'rxjs';

import { AppState } from '../app-state/app.state';
import { InlineTextInputComponent } from '../inputs/inline-text-input.component';
import { PopupService } from '../popup/popup.service';
import { AutofocusDirective } from './shared/autofocus.directive';
import { SiteComponent } from './site.component';
import { SiteStateModel } from './sites-state/site-state.model';
import { CloneSiteAction } from './sites-state/sites.actions';
import { SitesComponent } from './sites.component';

describe('SitesComponent', () => {
  let harness: RouterTestingHarness;
  let sites$: BehaviorSubject<SiteStateModel[]>;

  const site = (name: string, order: number): SiteStateModel => ({
    name,
    title: name,
    order,
    mediaUrl: '',
    '@attributes': { published: 1 },
  });

  /** Waits for the navigation, the render after it and the focus timers */
  const settle = async () => {
    for (let i = 0; i < 3; i++) {
      await harness.fixture.whenStable();
      harness.detectChanges();
    }
  };

  beforeEach(async () => {
    sites$ = new BehaviorSubject([site('', 0), site('second', 1)]);

    const store = {
      select: (selector: unknown) =>
        selector === AppState.getSite ? of('') : sites$,
      selectOnce: () => of(sites$.value),
      dispatch: (action: unknown) => {
        if (action instanceof CloneSiteAction) {
          sites$.next([
            ...sites$.value,
            site(`clone-of-${action.site.name}`, sites$.value.length),
          ]);
        }
        return of(undefined);
      },
    } as unknown as Store;

    await TestBed.configureTestingModule({
      declarations: [
        SitesComponent,
        SiteComponent,
        InlineTextInputComponent,
        AutofocusDirective,
      ],
      providers: [
        provideRouter([{ path: 'multisite', component: SitesComponent }]),
        { provide: Store, useValue: store },
        { provide: PopupService, useValue: {} },
        { provide: Dialog, useValue: {} },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    harness = await RouterTestingHarness.create();
    document.body.appendChild(harness.fixture.nativeElement);
  });

  afterEach(() => {
    harness.fixture.nativeElement.remove();
  });

  it('opens a copied site and puts the cursor in its title', async () => {
    await harness.navigateByUrl('/multisite?site=second');

    harness.routeNativeElement
      .querySelector<HTMLButtonElement>(
        'berta-site:last-of-type button[title="copy"]',
      )
      .click();
    await settle();

    expect(TestBed.inject(Router).url).toBe('/multisite?site=clone-of-second');
    // New sites are added at the end of the list
    const input = harness.routeNativeElement.querySelector<HTMLInputElement>(
      'berta-site:last-of-type .control-line input',
    );
    expect(input).toBeTruthy();
    expect(input.value).toBe('clone-of-second');
    expect(input.placeholder).toBe('Site title');
    expect(document.activeElement).toBe(input);
  });
});
