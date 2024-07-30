import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, take, tap } from 'rxjs';
import { environments } from '../../../environments/environments';
import { AuthService } from './auth.service';
import { Product } from '../interfaces/product.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  apiUrl: string = environments.apiUrl
  authKey: string | null = inject(AuthService).getAuthToken()
  http: HttpClient = inject(HttpClient)

  getProducts(): Observable<Product[]> {
      return this.http.get<Product[]>(`${this.apiUrl}/items`);
  }

  getProduct(id: number): Observable<Product>{
    return this.http.get<Product>(`${this.apiUrl}/items/${id}`).pipe(take(1))
  }

  createProduct(product: Product): Observable<Product>{
    return this.http.post<Product>(`${this.apiUrl}/items`, product).pipe(take(1))
  }

  updateProduct(id: number, updatedProduct: Product): Observable<Product>{
    return this.http.patch<Product>(`${this.apiUrl}/items/${id}`, updatedProduct).pipe(take(1))
  }

  deleteProduct(id: number): Observable<null>{
    return this.http.delete<null>(`${this.apiUrl}/items/${id}`).pipe(take(1))
  }  
}