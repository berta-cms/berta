import { HttpInterceptorFn } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {
  BehaviorSubject,
  MonoTypeOperatorFunction,
  Observable,
  combineLatest,
  defer,
} from 'rxjs';
import { distinctUntilChanged, finalize, scan } from 'rxjs/operators';

/**
 * The HTTP requests in flight. A request counts until it ends, however it ends: answered, failed
 * or canceled.
 */
@Injectable({ providedIn: 'root' })
export class PendingRequestsService {
  private readonly count = new BehaviorSubject(0);
  readonly count$ = this.count.asObservable();

  track<T>(request$: Observable<T>): Observable<T> {
    return defer(() => {
      this.count.next(this.count.value + 1);

      return request$.pipe(
        finalize(() => this.count.next(this.count.value - 1)),
      );
    });
  }
}

export const pendingRequestsInterceptor: HttpInterceptorFn = (request, next) =>
  inject(PendingRequestsService).track(next(request));

/**
 * Keeps a loading flag on while requests are pending, so the first of several requests to end
 * doesn't turn it off. Requests alone don't turn it on.
 */
export function whileRequestsPending(
  count$: Observable<number>,
): MonoTypeOperatorFunction<boolean> {
  return (isLoading$) =>
    combineLatest([isLoading$, count$]).pipe(
      scan(
        (isOn, [isLoading, count]) => isLoading || (isOn && count > 0),
        false,
      ),
      distinctUntilChanged(),
    );
}
