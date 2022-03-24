import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        pathMatch: 'full',
        component: LoginComponent,
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
export class AuthRoutingModule { }
