import { Component } from '@angular/core';
import { ShoppingService } from '../../services/shopping.service';
import { ShoppingList } from '../../interfaces/ShoppingList';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { InputNumber } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { OrderService } from '../../services/order.service';
import { CreateOrderRequestDto } from '../../dtos/order/CreateOrderRequestDto';
import { ProductOrderDto } from '../../dtos/order/ProductOrderDto';

@Component({
  selector: 'app-shopping-list',
  imports: [TableModule, CommonModule, InputNumber, FormsModule, ButtonModule],
  templateUrl: './shopping-list.component.html',
  styleUrl: './shopping-list.component.scss'
})
export class ShoppingListComponent {

  constructor(private shoppingService: ShoppingService, private orderService: OrderService) {}
  products: any[] = [];
  cols: any[] = [];
  
  shoppingList: ShoppingList[] = [];
  totalPrice: number = 0;
  
  ngOnInit() {
    this.shoppingList = this.shoppingService.getList();

    this.products = this.shoppingList.map(item => ({
      id: item.product.id,
      name: item.product.name,
      price: item.product.price * item.quantity,
      description: item.product.description,
      quantity: item.quantity
    }));

    this.cols = [
      { field: 'name', header: 'Prouct Name' },
      { field: 'description', header: 'Description' },
      { field: 'quantity', header: 'Quantity' },
      { field: 'price', header: 'Price' }
    ];
    this.summarizePrice();
  }

  onMakeOrder() {
    let request: CreateOrderRequestDto = new CreateOrderRequestDto();
    let productsInOrder: ProductOrderDto[] = [];
    this.shoppingList.forEach(item => {
      let productOrder: ProductOrderDto = new ProductOrderDto();
      productOrder.productId = item.product.id;
      productOrder.quantity = item.quantity;
      productOrder.unitPrice = item.product.price;
      productsInOrder.push(productOrder);
    });

    request.products = productsInOrder;
    request.customerId = 1; // Assuming a static customer ID for this example
    this.orderService.makeOrder(request).subscribe({
      next: (response) => {
        this.shoppingService.clearList();
        this.products = [];
        this.totalPrice = 0;
        this.shoppingList = [];
      },
      error: (error) => {
        console.error('Error making order', error);
      }});
  }

  onDeleteProduct(id: number) {
    this.products = this.products.filter(product => product.id !== id);
    this.shoppingService.setList(this.shoppingList.filter(item => item.product.id !== id));
  }

  summarizePrice() {
    this.totalPrice = this.shoppingList.reduce((acc, item) => {
      const productPrice = item.product.price * item.quantity;
      this.products.find(product => product.id === item.product.id).price = productPrice;
      return acc + productPrice;
    }, 0);
  }

  onQuantityChange(id: number) {
    const product = this.products.find(product => product.id === id);
    const shoppingItem = this.shoppingList.find(item => item.product.id === id);
    if (shoppingItem && product) {
      shoppingItem.quantity = product.quantity;
    }
    this.shoppingService.setList(this.shoppingList);
    this.summarizePrice();
  }
}

