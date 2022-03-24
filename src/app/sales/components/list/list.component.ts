import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SalesViewService } from '../../services/sales-view.service';
import { FormBuilder, FormControl } from '@angular/forms';
import { ProductSales } from '../../../shared/api/models/product-sales.model';
import { Column } from '../../../shared/api/models/column.model';
import { ModelFormGroup, ModelFormSpec } from '../../../shared/models/model-form.model';
import { NumericValidator } from '../../../shared/utils/forms';
import { Subscription } from 'rxjs';
import { AutoUnsubscribe } from '../../../shared/decorators/auto-unsubscribe.decorator';

export interface ProductSalesOverview extends ProductSales {
  total: number;
}

export type SalesOverview = { [k in keyof ProductSalesOverview]?: number; };

@Component({
  selector: 'grow-app-sales-list',
  templateUrl: './list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@AutoUnsubscribe()
export class ListComponent {
  readonly forms: { [k: string]: ModelFormGroup<ProductSales> } = {};

  private subscriptions: Subscription[] = [];

  constructor(public readonly viewService: SalesViewService, private readonly fb: FormBuilder) { }

  getFormControlFor(column: Column, sale: ProductSales): FormControl {
    if (!this.hasOwnProperty(sale.productID)) {
      const saleControls: ModelFormSpec<ProductSales> = {};
      Object.keys(sale).forEach(saleField => saleControls[saleField] = [sale[saleField], [NumericValidator]]);
      this.forms[sale.productID] = <ModelFormGroup<ProductSales>>this.fb.group(saleControls);
      this.subscriptions.push(
        this.forms[sale.productID].valueChanges
          .subscribe(changedSale => this.viewService.updateSale(changedSale)));
    }

    return <FormControl>this.forms[sale.productID].controls[column.field];
  }
}
