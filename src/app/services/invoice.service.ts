import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Invoice } from '../interfaces/Invoice';
import { environment } from '../../environments/environment.development';

@Injectable({ providedIn: 'root' })
export class InvoiceService {
  private apiUrl = `${environment.apiBaseUrl}/invoice`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(this.apiUrl);
  }

  create(invoice: Invoice): Observable<void> {
    return this.http.post<void>(this.apiUrl, invoice);
  }

  update(invoice: Invoice): Observable<void> {
    return this.http.put<void>(this.apiUrl, invoice);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}