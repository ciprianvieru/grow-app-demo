import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UserService } from '../../../shared/services/user.service';
import { FormBuilder, Validators } from '@angular/forms';
import { BehaviorSubject, Observable, timer } from 'rxjs';
import { distinctUntilChanged, filter, map, tap, withLatestFrom } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ModelFormGroup } from '../../../shared/models/model-form.model';
import { LOCK_MAX_ATTEMPTS, LOCK_TIMER } from '../../../shared/constants';
import { AuthenticatingUser } from '../../models/authenticating-user.model';
import { StoredUser } from '../../models/stored-user.model';
import { AutoUnsubscribe } from '../../../shared/decorators/auto-unsubscribe.decorator';

@Component({
  selector: 'grow-app-login',
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@AutoUnsubscribe()
export class LoginComponent {
  readonly form: ModelFormGroup<AuthenticatingUser>;
  readonly attempt$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  readonly isLocked$: Observable<boolean>;
  readonly LOCK_TIMER = LOCK_TIMER;

  constructor(public readonly userService: UserService,
              router: Router,
              formBuilder: FormBuilder) {
    this.form = <ModelFormGroup<AuthenticatingUser>>formBuilder.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]],
    });

    this.isLocked$ = this.attempt$
      .pipe(
        withLatestFrom(this.form.valueChanges.pipe(distinctUntilChanged())),
        tap(([, user]) => this.form.valid && this.userService.userAttempt$.next(<StoredUser>user)),
        withLatestFrom(this.userService.isAuthenticated$),
        map(([[attempt]]) => attempt > LOCK_MAX_ATTEMPTS),
        filter(v => !!v),
        tap(() => {
          const s = timer(LOCK_TIMER)
                    .subscribe(() => null, () => null,
                      () => s.unsubscribe() || this.attempt$.next(0) );
        }));
  }
}
