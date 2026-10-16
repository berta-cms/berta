import { fakeAsync, tick } from '@angular/core/testing';
import { Subject, Subscription } from 'rxjs';

import { delayedIndicator } from './delayed-indicator';

describe('delayedIndicator', () => {
  let isLoading: Subject<boolean>;
  let shows: boolean[];
  let subscription: Subscription;

  beforeEach(() => {
    isLoading = new Subject<boolean>();
    shows = [];
    subscription = isLoading
      .pipe(delayedIndicator())
      .subscribe((value) => shows.push(value));
  });

  afterEach(() => subscription.unsubscribe());

  it('shows nothing during a quick load', fakeAsync(() => {
    isLoading.next(false);
    isLoading.next(true);
    tick(299);
    isLoading.next(false);
    tick(1000);

    expect(shows).toEqual([false]);
  }));

  it('shows a slow load after the delay, and for at least the minimum time', fakeAsync(() => {
    isLoading.next(true);
    tick(299);
    expect(shows).toEqual([]);

    tick(1);
    expect(shows).toEqual([true]);

    tick(100);
    isLoading.next(false);
    tick(399);
    expect(shows).toEqual([true]);

    tick(1);
    expect(shows).toEqual([true, false]);
  }));

  it('hides at once after a load longer than the minimum time', fakeAsync(() => {
    isLoading.next(true);
    tick(900);
    isLoading.next(false);
    tick(0);

    expect(shows).toEqual([true, false]);
  }));

  it('keeps showing through a load that starts as the last one ends', fakeAsync(() => {
    isLoading.next(true);
    tick(400);
    isLoading.next(false);
    tick(100);
    isLoading.next(true);
    tick(1000);

    expect(shows).toEqual([true]);

    isLoading.next(false);
    tick(0);
    expect(shows).toEqual([true, false]);
  }));
});
