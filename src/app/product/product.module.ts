import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { EditComponent } from './components/new/edit.component';
import { ProductRoutingModule } from './product-routing.module';

@NgModule({
  declarations: [
    EditComponent,
  ],
  exports: [
    EditComponent,
  ],
  imports: [
    SharedModule,
    ProductRoutingModule,
  ],
})
export class ProductModule { }
