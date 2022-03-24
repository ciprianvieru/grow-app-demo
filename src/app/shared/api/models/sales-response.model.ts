import { Column } from './column.model';
import { ProductSales } from './product-sales.model';

export interface SalesResponse {
  column: Column[];
  data: ProductSales[];
}
