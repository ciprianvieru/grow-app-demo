import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EditComponent } from './components/new/edit.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        pathMatch: 'full',
        component: EditComponent,
      },
      {
        path: '**',
        redirectTo: '',
      },
    ]),
  ],
  exports: [
    RouterModule,
  ],
})
export class ProductRoutingModule { }
