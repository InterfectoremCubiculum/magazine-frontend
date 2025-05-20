import { ProductSupplierId } from './ProductSupplierId';
import { Supplier } from './Supplier';
import { Product } from './Product';

export interface ProductSupplier {
  id: ProductSupplierId;
  supplier: Supplier;
  product: Product;
  quantity: number;
  unitValue: number;
}