import { Order } from "./Order";
import { Product } from "./Product";

export interface ProductOrder {
  id: number;
  product: Product;
  order: Order;
  quantity: number;
  unityValue: number;
}