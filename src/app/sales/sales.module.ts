import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './components/list/list.component';
import { SalesRoutingModule } from './sales-routing.module';
import { TableModule } from 'primeng/table';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ListComponent,
  ],
  exports: [
    ListComponent,
  ],
  imports: [
    CommonModule,
    SalesRoutingModule,
    TableModule,
    ReactiveFormsModule,
  ],
})
export class SalesModule { }
