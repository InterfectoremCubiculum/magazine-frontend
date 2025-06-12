import { Customer } from "../../interfaces/Customer";
import { ProductOrderHistoryDto } from "../product/productOrderHistory.dto";

export interface OrderDto {
  id: number;
  customer: Customer;
  productOrderHistoryDto: ProductOrderHistoryDto[];
}