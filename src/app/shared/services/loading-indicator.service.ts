import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { LoadingIndicator } from '../models/loading-indicators.model';
import { FeedbackService } from './feedback.service';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class LoadingIndicatorService {
  readonly indicator = new LoadingIndicator();

  constructor(private readonly errorService: FeedbackService) { }

  startLoading(indicator?: LoadingIndicator): LoadingIndicator {
    this.indicator.startLoading();
    if (indicator && indicator !== this.indicator) {
      indicator.startLoading();
    }

    return indicator || this.indicator;
  }

  stopLoading(indicator?: LoadingIndicator): LoadingIndicator {
    this.indicator.stopLoading();
    if (indicator && indicator !== this.indicator) {
      indicator.stopLoading();
    }

    return indicator || this.indicator;
  }

  stopOnError(indicator?: LoadingIndicator): LoadingIndicator {
    this.indicator.stopOnError();
    if (indicator && indicator !== this.indicator) {
      indicator.stopOnError();
    }

    return indicator || this.indicator;
  }

  startObserving<T = any>(input: Observable<T>, indicator?: LoadingIndicator): Observable<T> {
    return new Observable<T>(subscriber => {
      this.errorService.clearErrors();
      this.startLoading(indicator);
      input
        .pipe(
          catchError((err: HttpErrorResponse) => {
            this.stopOnError(indicator);
            this.errorService.catch(err.statusText);

            return of(null);
          }),
          finalize(() => {
            this.stopLoading(indicator);
          }),
        )
        .subscribe(subscriber)
      ;
    });
  }
}
