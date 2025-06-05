import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Customer } from '../interfaces/Customer';
import { CreateCustomerDto } from '../dtos/customer/create-customer.dto';
import { UpdateCustomerDto } from '../dtos/customer/update-customer.dto';
import { environment } from '../../environments/environment.development';

@Injectable({ providedIn: 'root' })
export class CustomerService {
  private apiUrl = `${environment.apiBaseUrl}/customers`;

  constructor(private http: HttpClient) {}

  getMyAddresses(): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${this.apiUrl}/my-addresses`).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  getAll(): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${this.apiUrl}/admin/all`).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  getById(id: number): Observable<Customer> {
    return this.http.get<Customer>(`${this.apiUrl}/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  create(customerDto: CreateCustomerDto): Observable<Customer> {
    return this.http.post<Customer>(this.apiUrl, customerDto).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  update(id: number, customerDto: UpdateCustomerDto): Observable<Customer> {
    return this.http.put<Customer>(`${this.apiUrl}/${id}`, customerDto).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  setAsDefault(id: number): Observable<Customer> {
    return this.http.patch<Customer>(`${this.apiUrl}/${id}/set-default`, {}).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }
}
