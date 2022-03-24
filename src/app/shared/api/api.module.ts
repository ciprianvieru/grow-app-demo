import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { API_CONFIG, CONFIG_TOKEN } from '../constants';

// usually this module would be generated from an OpenAPI service description

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
  ],
  providers: [
    {
      provide: CONFIG_TOKEN,
      useValue: API_CONFIG,
    },
  ],
})
export class ApiModule { }
