import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private http = inject(HttpClient);
  private ordersUrl = `${environment.apiBaseUrl}/orders`;
  constructor() { }

  makeOrder(): Observable<any> {
    return this.http.post<any>(`${this.ordersUrl}`, {});
  }
}
