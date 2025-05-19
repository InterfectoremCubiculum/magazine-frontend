import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { Warehouse } from '../interfaces/Warehouse';
import { WarehouseDto } from '../dtos/warehouse/warehouse.dto';

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

  addWarehouse(warehouse: WarehouseDto): Observable<Warehouse> {
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
    const warehouseDto: WarehouseDto = {
      name: warehouse.name,
      location: warehouse.location
    };
    return this.http.put<Warehouse>(`${this.warehousesUrl}/${warehouse.id}`, warehouseDto).pipe(
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
