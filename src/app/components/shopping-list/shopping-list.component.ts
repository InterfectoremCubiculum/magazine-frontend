import { Component } from '@angular/core';
import { ShoppingService } from '../../services/shopping.service';
import { ShoppingList } from '../../interfaces/ShoppingList';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { InputNumber } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-shopping-list',
  imports: [TableModule, CommonModule, InputNumber, FormsModule, ButtonModule],
  templateUrl: './shopping-list.component.html',
  styleUrl: './shopping-list.component.scss'
})
export class ShoppingListComponent {

  constructor(private shoppingService: ShoppingService) {}
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
    throw new Error('Method not implemented.');
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

