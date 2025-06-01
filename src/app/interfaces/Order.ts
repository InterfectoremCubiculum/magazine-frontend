import { ProductOrder } from "./ProductOrder";

export interface Order {
  id: number;
  customer: { id: number; name?: string };
  productOrders: ProductOrder[];
}