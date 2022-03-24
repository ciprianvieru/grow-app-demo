import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * an object retaining async operations loading status and overall operations stats
 * Does NOT keep track of which is started/ended/erroneous
 */
export class LoadingIndicator {
  /**
   * keeps a number of how many async operations are in progress
   */
  readonly loading$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  /**
   * slag indicating that at least one async operation is in progress (loading)
   */
  readonly isLoading$: Observable<boolean>;
  /**
   * how many async operations have failed
   */
  readonly errors$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  /**
   * how many async operations were watched
   */
  readonly total$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  /**
   * how many async operations ended
   */
  readonly endedLoading$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  constructor() {
    this.isLoading$ = this.loading$
      .pipe(
        map(loading => loading > 0));
  }

  /**
   * start one async operation
   */
  startLoading() {
    this.loading$.next(this.loading$.value + 1);
    this.total$.next(this.total$.value + 1);
  }

  /**
   * mark one operation as erroneous
   */
  stopOnError() {
    this.errors$.next(this.errors$.value + 1);
  }

  /**
   * stop one async operation
   */
  stopLoading() {
    if (this.loading$.value === 0) {
      console.error('Stopping an unregistered loading indicator');
    } else {
      this.loading$.next(this.loading$.value - 1);
    }
    this.endedLoading$.next(this.endedLoading$.value + 1);
  }
}
