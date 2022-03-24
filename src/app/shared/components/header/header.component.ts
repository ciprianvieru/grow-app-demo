import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'grow-app-header',
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  @Input() title: string;
}
