import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { catchError, Observable, throwError } from 'rxjs';
import { CreateOrderRequestDto } from '../dtos/order/CreateOrderRequestDto';
import { OrderDto } from '../dtos/order/OrderDto';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private http = inject(HttpClient);
  private ordersUrl = `${environment.apiBaseUrl}/orders`;
  constructor() { }

  makeOrder(request: CreateOrderRequestDto): Observable<any> {
    return this.http.post<any>(`${this.ordersUrl}`, request).pipe(
        catchError((error) => {
          return throwError(() => new Error('Failed to make order'));
        })
      );;
  }
  getAllByUser(): Observable<OrderDto[]> {
    return this.http.get<OrderDto[]>(`${this.ordersUrl}/my-orders`);
  }
}
