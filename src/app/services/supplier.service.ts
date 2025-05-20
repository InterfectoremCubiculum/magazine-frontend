import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Supplier } from '../interfaces/Supplier';
import { environment } from '../../environments/environment.development';

@Injectable({ providedIn: 'root' })
export class SupplierService {
  private apiUrl = `${environment.apiBaseUrl}/suppliers`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Supplier[]> {
    return this.http.get<Supplier[]>(this.apiUrl);
  }

  get(id: number): Observable<Supplier> {
    return this.http.get<Supplier>(`${this.apiUrl}/${id}`);
  }

  create(supplier: Supplier): Observable<void> {
    return this.http.post<void>(this.apiUrl, supplier);
  }

  update(id: number, supplier: Supplier): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, supplier);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}