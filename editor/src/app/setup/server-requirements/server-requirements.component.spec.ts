import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { of } from 'rxjs';
import { ServerRequirementsComponent } from './server-requirements.component';
import { ServerRequirementsService } from './server-requirements.service';
import {
  RequirementModel,
  RequirementsResponse,
} from './server-requirements.interface';

function requirement(
  key: string,
  ok: boolean,
  fatal = true,
  group: RequirementModel['group'] = 'server',
): RequirementModel {
  return { key, group, label: key, ok, fatal, message: ok ? '' : 'Fix it' };
}

describe('ServerRequirementsComponent', () => {
  let fixture: ComponentFixture<ServerRequirementsComponent>;
  let element: HTMLElement;
  let response: RequirementsResponse;
  let service: jasmine.SpyObj<ServerRequirementsService>;
  let store: jasmine.SpyObj<Store>;
  let router: { url: string; navigate: jasmine.Spy };

  const render = (value: RequirementsResponse) => {
    response = value;
    fixture = TestBed.createComponent(ServerRequirementsComponent);
    element = fixture.nativeElement;
    fixture.detectChanges();
  };

  const buttonLabels = () =>
    Array.from(element.querySelectorAll('.actions button')).map((button) =>
      button.textContent.trim(),
    );

  beforeEach(async () => {
    sessionStorage.removeItem('berta-server-requirements-dismissed');
    service = jasmine.createSpyObj('ServerRequirementsService', ['check']);
    service.check.and.callFake(() => of(response));
    store = jasmine.createSpyObj('Store', ['selectSnapshot']);
    store.selectSnapshot.and.returnValue(false);
    router = { url: '/', navigate: jasmine.createSpy('navigate') };

    await TestBed.configureTestingModule({
      declarations: [ServerRequirementsComponent],
      providers: [
        { provide: ServerRequirementsService, useValue: service },
        { provide: Store, useValue: store },
        { provide: Router, useValue: router },
      ],
    }).compileComponents();
  });

  afterEach(() => {
    sessionStorage.removeItem('berta-server-requirements-dismissed');
  });

  it('renders nothing when all requirements are met', () => {
    render({
      installed: false,
      requirements: [requirement('php', true), requirement('gd', true)],
    });

    expect(element.querySelector('.server-requirements')).toBeNull();
  });

  it('renders nothing once Berta is installed', () => {
    render({ installed: true, requirements: [requirement('php', false)] });

    expect(element.querySelector('.server-requirements')).toBeNull();
  });

  it('blocks with a fatal failure and offers only to check again', () => {
    render({
      installed: false,
      requirements: [
        requirement('storage', false, true, 'installation'),
        requirement('upload_size', false, false),
      ],
    });

    expect(
      element.querySelector('.server-requirements-overlay'),
    ).not.toBeNull();
    expect(element.querySelector('h2').textContent).toContain('Take action!');
    expect(element.querySelectorAll('li.fail').length).toBe(1);
    expect(element.querySelectorAll('li.warning').length).toBe(1);
    expect(buttonLabels()).toEqual(['Check again']);
  });

  it('shows the API error payload from a failed boot', () => {
    render({ installed: null, requirements: [requirement('php', false)] });

    expect(element.querySelector('.server-requirements')).not.toBeNull();
  });

  it('lets warnings be dismissed for the session', () => {
    render({
      installed: false,
      requirements: [
        requirement('php', true),
        requirement('upload_size', false, false),
      ],
    });

    expect(buttonLabels()).toEqual(['Check again', 'Continue anyway']);

    (
      element.querySelectorAll('.actions button')[1] as HTMLButtonElement
    ).click();
    fixture.detectChanges();
    expect(element.querySelector('.server-requirements')).toBeNull();

    render(response);
    expect(element.querySelector('.server-requirements')).toBeNull();
  });

  it('checks again and closes once requirements are met', () => {
    render({
      installed: false,
      requirements: [requirement('storage', false)],
    });

    response = {
      installed: false,
      requirements: [requirement('storage', true)],
    };
    (element.querySelector('.actions button') as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(service.check).toHaveBeenCalledTimes(2);
    expect(element.querySelector('.server-requirements')).toBeNull();
  });

  it('lists passed checks on request', () => {
    render({
      installed: false,
      requirements: [requirement('php', true), requirement('storage', false)],
    });

    expect(element.querySelectorAll('li.ok').length).toBe(0);

    (element.querySelector('.toggle-passed') as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(element.querySelectorAll('li.ok').length).toBe(1);
  });

  describe('login redirect', () => {
    const notInstalled: RequirementsResponse = {
      installed: false,
      requirements: [requirement('php', true)],
    };

    it('sends logged out visitors on the root route to the login screen', () => {
      render(notInstalled);

      expect(router.navigate).toHaveBeenCalledWith(['/login'], {
        queryParamsHandling: 'preserve',
      });
    });

    it('does not redirect logged in users', () => {
      store.selectSnapshot.and.returnValue(true);
      render(notInstalled);

      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('does not redirect once Berta is installed', () => {
      render({ installed: true, requirements: [] });

      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('does not redirect when the API could not report the installed state', () => {
      render({ installed: null, requirements: [requirement('php', false)] });

      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('does not redirect from other routes', () => {
      router.url = '/login?site=demo';
      render(notInstalled);

      expect(router.navigate).not.toHaveBeenCalled();
    });
  });
});
