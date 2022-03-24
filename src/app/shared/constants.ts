import { InjectionToken } from '@angular/core';

export const CONFIG_TOKEN = new InjectionToken('API Config Token');

export type ApiConfig = {
  baseUrl: string;
  sales: string;
};

export const API_CONFIG: ApiConfig = {
  baseUrl: '/assets',
  sales: 'potato_sales.json',
};

export const LOCK_TIMER = 3000;
export const LOCK_MAX_ATTEMPTS = 5;

export const SUCCESS_MESSAGE_AUTO_HIDE = 5000;
