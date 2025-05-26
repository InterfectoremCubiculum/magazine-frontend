import { ProductOrderDto } from "./ProductOrderDto";

export class CreateOrderRequestDto {
    customerId?: number;
    products?: ProductOrderDto[];
}