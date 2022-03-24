import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiConfig, CONFIG_TOKEN } from '../../constants';
import { Observable } from 'rxjs';
import { SalesResponse } from '../models/sales-response.model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {

  constructor(@Inject(CONFIG_TOKEN) private config: ApiConfig, private http: HttpClient) { }

  getSales(): Observable<SalesResponse> {
    return <Observable<SalesResponse>> this.http.get(this.getServiceUrl('sales'));
  }

  protected getServiceUrl(serviceName: string): string {
    if (!this.config.hasOwnProperty(serviceName)) {
      throw new Error(`'${serviceName}' is not configured`);
    }
    return [this.config.baseUrl, this.config[serviceName]].join('/x/');
  }
}
