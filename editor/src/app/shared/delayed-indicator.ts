import { MonoTypeOperatorFunction, defer, of, timer } from 'rxjs';
import { distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';

/** A load quicker than this shows no loading indicator */
export const LOADING_INDICATOR_DELAY = 300;

/** A shown loading indicator stays at least this long, so it doesn't blink */
export const LOADING_INDICATOR_MIN_DURATION = 500;

/**
 * Turns whether something loads into whether its indicator shows. A quick load shows nothing, and
 * a shown indicator stays at least LOADING_INDICATOR_MIN_DURATION, through a load that starts
 * again meanwhile.
 */
export function delayedIndicator(): MonoTypeOperatorFunction<boolean> {
  return (isLoading$) =>
    defer(() => {
      let shownAt: number | null = null;

      return isLoading$.pipe(
        distinctUntilChanged(),
        switchMap((isLoading) => {
          if (shownAt !== null) {
            if (isLoading) {
              return of(true);
            }
            const shownFor = Date.now() - shownAt;

            return timer(
              Math.max(0, LOADING_INDICATOR_MIN_DURATION - shownFor),
            ).pipe(
              tap(() => (shownAt = null)),
              map(() => false),
            );
          }

          return isLoading
            ? timer(LOADING_INDICATOR_DELAY).pipe(
                tap(() => (shownAt = Date.now())),
                map(() => true),
              )
            : of(false);
        }),
        distinctUntilChanged(),
      );
    });
}
