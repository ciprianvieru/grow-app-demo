import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ApiModule } from './api/api.module';
import { RouterModule } from '@angular/router';
import { NavComponent } from './components/nav/nav.component';
import { MessagesComponent } from './components/messages/messages.component';
import { HeaderComponent } from './components/header/header.component';

@NgModule({
  declarations: [
    NavComponent,
    MessagesComponent,
    HeaderComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    TableModule,
    ApiModule,
  ],
  exports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    TableModule,
    ApiModule,
    NavComponent,
    MessagesComponent,
    HeaderComponent,
  ],
})
export class SharedModule {
}
