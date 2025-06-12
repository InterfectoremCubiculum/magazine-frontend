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
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CustomerService } from '../../services/customer.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Customer } from '../../interfaces/Customer';
import { MessageService } from 'primeng/api';
import { TabsModule } from 'primeng/tabs';

@Component({
  selector: 'app-shopping-list',
  imports: [TableModule, CommonModule, InputNumber, FormsModule, ButtonModule, TabsModule, CommonModule],
  templateUrl: './shopping-list.component.html',
  styleUrl: './shopping-list.component.scss',
  providers: [MessageService],
})
export class ShoppingListComponent {

  constructor(
    private shoppingService: ShoppingService, 
    private orderService: OrderService, 
    private customerService: CustomerService,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {}
  products: any[] = [];
  cols: any[] = [];
  addresses: Customer[] = [];

  shoppingList: ShoppingList[] = [];
  totalPrice: number = 0;
  addressId: number | null = null;

  ngOnInit() {
    this.loadAddresses();
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

loadAddresses(): void {
    this.customerService.getMyAddresses().subscribe({
      next: (addresses: Customer[]) => {
        this.addresses = addresses;
      },
      error: (error: HttpErrorResponse) => {
        let errorMessage = 'Nie udało się załadować adresów';
        if (error.status === 401) {
          errorMessage = 'Sesja wygasła. Zaloguj się ponownie.';
        } else if (error.status === 403) {
          errorMessage = 'Brak uprawnień do przeglądania adresów';
        } else if (error.status === 0) {
          errorMessage = 'Brak połączenia z serwerem';
        }

        this.messageService.add({
          severity: 'error',
          summary: 'Błąd',
          detail: errorMessage
        });
      }
    });
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
    request.customerId = this.addressId ?? this.defaultAddressId();
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

    this.router.navigate(['/order-history']);
  }

  onDeleteProduct(id: number) {
    this.products = this.products.filter(product => product.id !== id);
    this.shoppingService.setList(this.shoppingList.filter(item => item.product.id !== id));

    if (this.products.length === 0) {
      this.router.navigate(['/product']);
    }
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

  defaultAddressId(): number {
    if (this.addresses.length > 0) {
      const defaultAddress = this.addresses.find(address => address.isDefault);
      if (defaultAddress) {
        return defaultAddress.id ?? 0 ;
      }
    }
    return 0;
  }

  setAddressId(addressId: number | null) {
    this.addressId = addressId;
  }
}

