import { Injectable } from '@angular/core';
import { User } from '../../auth/models/user.model';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthenticatingUser } from '../../auth/models/authenticating-user.model';
import { StoredUser } from '../../auth/models/stored-user.model';
import { AutoUnsubscribe } from '../decorators/auto-unsubscribe.decorator';

@Injectable({
  providedIn: 'root',
})
@AutoUnsubscribe()
export class UserService implements CanActivate {
  readonly userAttempt$: BehaviorSubject<AuthenticatingUser> = new BehaviorSubject<AuthenticatingUser>(null);
  readonly storedUsers$: BehaviorSubject<StoredUser[]> = new BehaviorSubject<StoredUser[]>([
    <StoredUser> {
      username: 'u1',
      password: 'u1',
    },
    <StoredUser> {
      username: 'u2',
      password: 'u2',
    },
  ]);
  readonly isAuthenticated$: Observable<boolean>;
  readonly user$: Observable<User>;

  constructor(private router: Router) {
    this.user$ = combineLatest([this.userAttempt$, this.storedUsers$])
      .pipe(
        map(([user, users]) => user && users.find(u => u.username === user.username
                                               && u.password === user.password)),
        map(user => user
          ? <User> { username: user.username }
          : null),
      );
    this.isAuthenticated$ = this.user$.pipe(
      map(user => !!user),
    );
    const isAuthenticatedSubscription = this.isAuthenticated$
      .subscribe(isAuthenticated => isAuthenticated && this.router.navigateByUrl('/home')
        .finally(() => isAuthenticatedSubscription.unsubscribe()));
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean|UrlTree> {
    return this.isAuthenticated$.pipe(
      map(isAuthenticated => isAuthenticated || this.router.parseUrl('/login')));
  }
}
