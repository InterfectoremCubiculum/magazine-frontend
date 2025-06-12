import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { OrderDto } from '../../dtos/order/OrderDto';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    CardModule,
    MessageModule,
    MessagesModule
  ],
})
export class OrderHistoryComponent implements OnInit {
  orders: OrderDto[] = [];
  loading = false;

  constructor(
    private orderService: OrderService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const userId = this.authService.getCurrentUser()?.id;
    if (userId) {
      this.loading = true;
      this.orderService.getAllByUser().subscribe({
        next: (orders) => {
          this.orders = orders;
          console.log('Orders fetched:', orders);
          this.loading = false;
        },
        error: () => {
          console.error('Failed to fetch orders');
          this.loading = false;
        }
      });
    }
  }
}