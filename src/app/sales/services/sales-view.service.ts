import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { Product } from '../../shared/api/models/product.model';
import { Column } from '../../shared/api/models/column.model';
import { filter, map, publishReplay, refCount, tap } from 'rxjs/operators';
import { LoadingIndicatorService } from '../../shared/services/loading-indicator.service';
import { ApiService } from '../../shared/api/services/api.service';
import { SalesResponse } from '../../shared/api/models/sales-response.model';
import { ProductSales } from '../../shared/api/models/product-sales.model';
import { createProductSales } from '../../shared/api/models/model-factory';
import { ProductSalesOverview, SalesOverview } from '../components/list/list.component';
import { LoadingIndicator } from '../../shared/models/loading-indicators.model';
import { AutoUnsubscribe } from '../../shared/decorators/auto-unsubscribe.decorator';

@Injectable({
  providedIn: 'root',
})
@AutoUnsubscribe()
export class SalesViewService {
  readonly response$: Observable<SalesResponse>;
  readonly salesSubject$: BehaviorSubject<ProductSales[]> = new BehaviorSubject<ProductSales[]>([]);
  readonly columnsSubject$: BehaviorSubject<Column[]> = new BehaviorSubject<Column[]>([]);
  readonly columnsWithSubColumns$: Observable<Column[]>;
  readonly valueColumns$: Observable<Column[]>;
  readonly salesColumns$: Observable<(keyof ProductSalesOverview)[]>;
  readonly indicator: LoadingIndicator;
  readonly values$: Observable<ProductSalesOverview[]>;
  readonly search$: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  readonly totals$: Observable<SalesOverview>;

  private readonly subscriptions: Subscription[] = [];

  constructor(apiService: ApiService, indicatorService: LoadingIndicatorService) {
    this.indicator = indicatorService.indicator;
    this.response$ = indicatorService.startObserving(apiService.getSales())
      .pipe(
        filter(response => !!response),
        publishReplay(),
        refCount(),
      )
    ;

    this.columnsWithSubColumns$ = this.columnsSubject$
      .pipe(
        map(columns => columns.reduce((subColumns, column) => subColumns.concat(...(column.subHeaders || [])), [])));
    this.salesColumns$ = this.columnsWithSubColumns$
      .pipe(
        map((columns) => columns.filter(column => this.isTotalsColumn(column) || this.isSalesColumn(column))),
        map((columns) => columns.map(column => <keyof ProductSalesOverview> column.field)));
    this.valueColumns$ = this.columnsSubject$
      .pipe(
        map(columns => columns.reduce((valueColumns, column) =>
          valueColumns.concat(...(column.subHeaders || [column])), [])),
      );
    const values$ = this.salesSubject$
      .pipe(
        map(products => products.map(productSale => <ProductSalesOverview> {
          ...productSale,
          total: Object.keys(productSale)
            .filter(field => this.isSalesField(field))
            .reduce((sum, salesField) => sum + (productSale[salesField] || 0), 0),
        })));

    this.values$ = combineLatest([this.search$, values$])
      .pipe(
        map(([quickFilter, values]: [string, ProductSalesOverview[]]) => values.filter(sale =>
          Object.keys(sale)
            .filter(field => (sale[field] || '').toString().toLowerCase().includes((quickFilter || '').toLowerCase())).length > 0)),
      )
    ;

    this.totals$ = combineLatest([this.salesColumns$, this.values$])
      .pipe(
        map(([columns, values]) =>
          columns.reduce((totals: SalesOverview, currentColumn): SalesOverview => <SalesOverview> {
            ...totals,
            [currentColumn]: values.reduce((sum: number, currentSale: ProductSalesOverview) =>
              sum + <number> currentSale[currentColumn], 0),
          }, {})),
        tap(totals => totals.total = Object.values(totals).reduce((sum, salesQ) => sum + salesQ, 0)));
  }

  get columns$(): BehaviorSubject<Column[]> {
    this.load();
    return this.columnsSubject$;
  }

  addProduct(product: Product) {
    this.salesSubject$.next([...this.salesSubject$.value, createProductSales(product)]);
  }

  isSalesField(field: string): boolean {
    return (field || '').startsWith('salesQ');
  }

  isSalesColumn(column: Column): boolean {
    return this.isSalesField(column.field);
  }

  isTotalsColumn(column: Column): boolean {
    return !column.field && !column.subHeaders;
  }

  isNumberColumn(column: Column): boolean {
    return this.isTotalsColumn(column)
      || this.isSalesColumn(column)
      || column.field === 'productID'
      ;
  }

  updateSale(changedSale: ProductSales) {
    this.salesSubject$.next(
      this.salesSubject$.value.map(sale => sale.productID === changedSale.productID ? changedSale : sale));
  }

  private load() {
    if (!this.subscriptions.length) {
      this.subscriptions.push(
        this.response$.subscribe(response => {
          this.salesSubject$.next([
            ...this.salesSubject$.value,
            ...response.data,
          ]);
          this.columnsSubject$.next(response.column);
        }));
    }
  }
}
