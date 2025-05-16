import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment.development';

export interface Warehouse {
  id: number;
  name: string;
  location?: string;
}

const API_BASE_URL = '/api';

@Injectable({
  providedIn: 'root'
})
export class WarehouseService {
  private http = inject(HttpClient);
  private warehousesUrl = `${environment.apiBaseUrl}/warehouses`;
  
  getWarehouses(): Observable<Warehouse[]> {
    return this.http.get<Warehouse[]>(`${this.warehousesUrl}`).pipe(
      catchError((error) => {
        return throwError(() => new Error('Failed to fetch warehouses'));
      })
    );
  }

  addWarehouse(warehouse: Warehouse): Observable<Warehouse> {
    return this.http.post<Warehouse>(this.warehousesUrl, warehouse).pipe(
      catchError((error) => {
        return throwError(() => new Error('Failed to add warehouse'));
      })
    );
  }

  updateWarehouse(warehouse: Warehouse): Observable<Warehouse> {
    if (!warehouse.id) {
      return throwError(() => new Error('Warehouse ID is required'));
    }
    return this.http.put<Warehouse>(`${this.warehousesUrl}/${warehouse.id}`, warehouse).pipe(
      catchError((error) => {
        return throwError(() => new Error('Failed to update warehouse'));
      })
    );
  }
  
  deleteWarehouse(id: number): Observable<void> {
    return this.http.delete<void>(`${this.warehousesUrl}/${id}`).pipe(
      catchError((error) => {
        return throwError(() => new Error('Failed to delete warehouse'));
      })
    );
  }
}
