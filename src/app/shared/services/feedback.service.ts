import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, timer } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { SUCCESS_MESSAGE_AUTO_HIDE } from '../constants';

@Injectable({
  providedIn: 'root',
})
export class FeedbackService {
  readonly successes$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  readonly errors$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  readonly hasError$: Observable<boolean> = this.errors$.pipe(map(message => !!message));

  constructor() {
    this.hasError$ = this.errors$
      .pipe(
        map(errors => errors.length > 0),
      );
  }

  success(message: string) {
    this.successes$.next([...this.successes$.value, message]);
    const timerSubscription = timer(SUCCESS_MESSAGE_AUTO_HIDE).pipe(finalize(() => {
      this.successes$.next(this.successes$.value.filter(m => m !== message));
      timerSubscription.unsubscribe();
    })).subscribe();
  }

  catch(error: string) {
    this.errors$.next([error]);
  }

  clearErrors() {
    this.errors$.next([]);
  }

  clearError(error: string) {
    this.errors$.next(this.errors$.value.filter(e => e !== error));
  }
}
