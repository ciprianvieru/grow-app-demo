import { Product } from './product.model';
import { ProductSales } from './product-sales.model';

export function createProduct(defaults?: Partial<Product>): Required<Product> {
  return <Required<Product>> {
    name: null,
    manager: null,
    salesStartDate: null,
    id: null,
    ...defaults,
  };
}

export function createProductSales(product: Partial<Product>, defaults?: Partial<ProductSales>): Required<ProductSales> {
  return <Required<ProductSales>> {
    productID: product.id,
    productName: product.name,
    salesQ1: null,
    salesQ2: null,
    salesQ3: null,
    salesQ4: null,
    ...defaults,
  };
}
