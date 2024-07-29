import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
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
    return this.http.get<Product>(`${this.apiUrl}/items/${id}`)
  }

  createProduct(product: Product): Observable<Product>{
    return this.http.post<Product>(`${this.apiUrl}/items`, product)
  }

  updateProduct(id: number, updatedProduct: Product): Observable<Product>{
    return this.http.patch<Product>(`${this.apiUrl}/items/${id}`, updatedProduct)
  }

  deleteProduct(id: number): Observable<Product>{
    return this.http.delete<Product>(`${this.apiUrl}/items/${id}`)
  }  
}