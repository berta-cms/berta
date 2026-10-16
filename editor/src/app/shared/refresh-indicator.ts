import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { LOADING_INDICATOR_DELAY } from './delayed-indicator';

/**
 * The refresh icon's half turn, as in its spin in _utils.scss. Its arrows look the same after a
 * half turn, so the spin stops on one without a jump.
 */
const REFRESH_ICON_HALF_TURN = 500;

/**
 * The loading state behind a list's Refresh button. A quick load shows nothing, so the indicator
 * doesn't flash.
 */
export class RefreshIndicator {
  isLoading = false;
  /**
   * Whether the refresh icon spins: from LOADING_INDICATOR_DELAY into a load until the half turn
   * it's on when the load ends
   */
  showsLoading = false;
  private loadCount = 0;
  private shownAt = 0;
  /** Shows the indicator while loading, hides it after the load */
  private timer: ReturnType<typeof setTimeout> | undefined;

  /**
   * Indicates the load while it runs. A load started while another runs takes the indicator over,
   * so the other's end doesn't stop it.
   *
   * @param onEnd Runs when the load ends, unless a newer one has started
   */
  track<T>(load$: Observable<T>, onEnd?: () => void): Observable<T> {
    const load = ++this.loadCount;
    this.start();

    return load$.pipe(
      finalize(() => {
        if (load === this.loadCount) {
          onEnd?.();
          this.stop();
        }
      }),
    );
  }

  destroy() {
    clearTimeout(this.timer);
  }

  private start() {
    if (!this.isLoading) {
      // Keeps spinning an icon that is about to stop
      clearTimeout(this.timer);
      if (!this.showsLoading) {
        this.timer = setTimeout(() => {
          this.showsLoading = true;
          this.shownAt = Date.now();
        }, LOADING_INDICATOR_DELAY);
      }
    }
    this.isLoading = true;
  }

  /** Stops the icon at the end of its half turn, where it looks as at rest */
  private stop() {
    this.isLoading = false;
    clearTimeout(this.timer);
    if (this.showsLoading) {
      const shownFor = Date.now() - this.shownAt;
      const halfTurns = Math.max(
        1,
        Math.ceil(shownFor / REFRESH_ICON_HALF_TURN),
      );
      this.timer = setTimeout(
        () => (this.showsLoading = false),
        halfTurns * REFRESH_ICON_HALF_TURN - shownFor,
      );
    }
  }
}
