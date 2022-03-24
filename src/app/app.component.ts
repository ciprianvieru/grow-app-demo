import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UserService } from './shared/services/user.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'grow-app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  isAuthenticatedSubscription: Subscription;
  constructor(public userService: UserService, router: Router) {
  }
}
