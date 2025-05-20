import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductSupplier } from '../interfaces/ProductSupplier';
import { environment } from '../../environments/environment.development';

@Injectable({ providedIn: 'root' })
export class ProductSupplierService {
  private apiUrl = `${environment.apiBaseUrl}/product-suppliers`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<ProductSupplier[]> {
    return this.http.get<ProductSupplier[]>(this.apiUrl);
  }

  getById(productId: number, supplierId: number): Observable<ProductSupplier> {
    return this.http.get<ProductSupplier>(`${this.apiUrl}/${productId}/${supplierId}`);
  }

  create(productSupplier: ProductSupplier): Observable<void> {
    return this.http.post<void>(this.apiUrl, productSupplier);
  }

  update(productSupplier: ProductSupplier): Observable<void> {
    return this.http.put<void>(this.apiUrl, productSupplier);
  }

  delete(productId: number, supplierId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${productId}/${supplierId}`);
  }
}