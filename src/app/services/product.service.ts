import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { catchError, Observable, throwError } from 'rxjs';
import { Product } from '../interfaces/Product';
import { ProductDto } from '../dtos/product/product.dto';
import { PageResponse } from '../interfaces/PageResponse';
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);
  private productsUrl = `${environment.apiBaseUrl}/products`;
  
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.productsUrl}`).pipe(
      catchError((error) => {
        return throwError(() => new Error('Failed to fetch products'));
      })
    );
  }
  getProductsPagination(params: HttpParams): Observable<PageResponse<Product>> {
    return this.http.get<PageResponse<Product>>(`${this.productsUrl}`, { params }).pipe(
      catchError((error) => {
        return throwError(() => new Error('Failed to fetch products'));
      })
    );
  }

  addProduct(product: ProductDto): Observable<Product> {
    return this.http.post<Product>(this.productsUrl, product).pipe(
      catchError((error) => {
        return throwError(() => new Error('Failed to add product'));
      })
    );
  }

  updateProduct(product: Product): Observable<Product> {
    if (!product.id) {
      return throwError(() => new Error('Products ID is required'));
    }
    const productDto: ProductDto = {
      name: product.name,
      weight: product.weight,
      price: product.price,
      description: product.description,
      categoryId: product.category.id
    };
    return this.http.put<Product>(`${this.productsUrl}/${product.id}`, productDto).pipe(
      catchError((error) => {
        return throwError(() => new Error('Failed to update product'));
      })
    );
  }
  
  deleteWarehouse(id: number): Observable<void> {
    return this.http.delete<void>(`${this.productsUrl}/${id}`).pipe(
      catchError((error) => {
        return throwError(() => new Error('Failed to delete product'));
      })
    );
  }
}
