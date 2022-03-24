import { ProductSales } from './product-sales.model';

export interface Column {
  header: string;
  field: keyof ProductSales | string;
  subHeaders?: Column[];
}
