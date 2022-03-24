import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'grow-app-home',
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent { }
