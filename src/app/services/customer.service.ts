import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Customer } from '../interfaces/Customer';
import { environment } from '../../environments/environment.development';

@Injectable({ providedIn: 'root' })
export class CustomerService {
  private apiUrl = `${environment.apiBaseUrl}/customer`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.apiUrl);
  }
}