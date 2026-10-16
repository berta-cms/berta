import { TestBed } from '@angular/core/testing';
import {
  HttpClient,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';

import {
  PendingRequestsService,
  pendingRequestsInterceptor,
  whileRequestsPending,
} from './pending-requests';

describe('pendingRequestsInterceptor', () => {
  let http: HttpClient;
  let backend: HttpTestingController;
  let counts: number[];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([pendingRequestsInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    http = TestBed.inject(HttpClient);
    backend = TestBed.inject(HttpTestingController);
    counts = [];
    TestBed.inject(PendingRequestsService).count$.subscribe((count) =>
      counts.push(count),
    );
  });

  afterEach(() => backend.verify());

  it('counts a request until it is answered or fails', () => {
    http.get('/_api/v1/meta').subscribe();
    http.get('/_api/v1/state').subscribe({ error: () => {} });

    backend.expectOne('/_api/v1/meta').flush({});
    backend
      .expectOne('/_api/v1/state')
      .flush('', { status: 500, statusText: 'Server Error' });

    expect(counts).toEqual([0, 1, 2, 1, 0]);
  });

  it('stops counting a canceled request', () => {
    const request = http.get('/_api/v1/meta').subscribe();
    const pending = backend.expectOne('/_api/v1/meta');

    request.unsubscribe();

    expect(pending.cancelled).toBeTrue();
    expect(counts).toEqual([0, 1, 0]);
  });
});

describe('whileRequestsPending', () => {
  let isLoading: Subject<boolean>;
  let count: BehaviorSubject<number>;
  let isOn: boolean[];
  let subscription: Subscription;

  beforeEach(() => {
    isLoading = new Subject<boolean>();
    count = new BehaviorSubject(0);
    isOn = [];
    subscription = isLoading
      .pipe(whileRequestsPending(count))
      .subscribe((value) => isOn.push(value));
  });

  afterEach(() => subscription.unsubscribe());

  it('stays on while a request is still pending, until the last one ends', () => {
    isLoading.next(true);
    count.next(1);
    count.next(2);
    // The first request ends and turns the flag off
    count.next(1);
    isLoading.next(false);

    expect(isOn).toEqual([true]);

    count.next(0);
    expect(isOn).toEqual([true, false]);
  });

  it('stays off for requests while the flag is off', () => {
    isLoading.next(false);
    count.next(1);
    count.next(0);

    expect(isOn).toEqual([false]);
  });

  it('turns off with the flag when no request is pending', () => {
    isLoading.next(true);
    isLoading.next(false);

    expect(isOn).toEqual([true, false]);
  });
});
