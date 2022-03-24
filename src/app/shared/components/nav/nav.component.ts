import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'grow-app-nav',
  templateUrl: './nav.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavComponent {
  constructor(private readonly route: ActivatedRoute) { }

  isActiveRoute(segment: string): boolean {
    return this.route.pathFromRoot.toString().startsWith(segment);
  }
}
