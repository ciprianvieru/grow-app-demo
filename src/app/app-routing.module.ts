import { isDevMode, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserService } from './shared/services/user.service';

@NgModule({
  imports: [
    RouterModule.forRoot([
      {path: 'index.html', redirectTo: 'home', pathMatch: 'full'},
      {path: '', redirectTo: 'home', pathMatch: 'full'},
      {
        path: 'home',
        loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
        canActivate: [UserService],
      },
      {
        path: 'product',
        loadChildren: () => import('./product/product.module').then(m => m.ProductModule),
        canActivate: [UserService],
      },
      {
        path: 'sales',
        loadChildren: () => import('./sales/sales.module').then(m => m.SalesModule),
        canActivate: [UserService],
      },
      {
        path: 'login',
        loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
      },
    ], { enableTracing: isDevMode() }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
