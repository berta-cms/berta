import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { ServerRequirementsService } from './server-requirements.service';
import { RequirementsResponse } from './server-requirements.interface';

describe('ServerRequirementsService', () => {
  let service: ServerRequirementsService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ServerRequirementsService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('returns the requirements', () => {
    const body: RequirementsResponse = { installed: false, requirements: [] };
    let result: RequirementsResponse;

    service.check().subscribe((response) => (result = response));
    http.expectOne('/_api/v1/requirements').flush(body);

    expect(result).toEqual(body);
  });

  it('checks the installed state again on every call', () => {
    const values: boolean[] = [];

    service.isNotInstalled().subscribe((value) => values.push(value));
    http
      .expectOne('/_api/v1/requirements')
      .flush({ installed: false, requirements: [] });

    // Setup finished in the meantime, e.g. logout after the setup wizard
    service.isNotInstalled().subscribe((value) => values.push(value));
    http
      .expectOne('/_api/v1/requirements')
      .flush({ installed: true, requirements: [] });

    expect(values).toEqual([true, false]);
  });

  it('uses the requirements payload of the pre-boot guard error', () => {
    const body: RequirementsResponse = {
      installed: null,
      requirements: [
        {
          key: 'php',
          group: 'server',
          label: 'PHP',
          ok: false,
          fatal: true,
          message: 'Too old',
        },
      ],
    };
    let result: RequirementsResponse;

    service.check().subscribe((response) => (result = response));
    http
      .expectOne('/_api/v1/requirements')
      .flush(body, { status: 503, statusText: 'Service Unavailable' });

    expect(result).toEqual(body);
  });

  it('reports an unreadable API error as a warning, never blocking', () => {
    let result: RequirementsResponse;

    service.check().subscribe((response) => (result = response));
    http.expectOne('/_api/v1/requirements').flush('Composer detected issues', {
      status: 500,
      statusText: 'Server Error',
    });

    expect(result.installed).toBeNull();
    expect(result.requirements.length).toBe(1);
    expect(result.requirements[0].ok).toBeFalse();
    expect(result.requirements[0].fatal).toBeFalse();
    expect(result.requirements[0].message).toContain('500');
  });
});
