import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, take, tap } from 'rxjs';
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
  private productsSubject: BehaviorSubject<Product[]> = new BehaviorSubject<Product[]>([]);

  constructor() {
    this.loadProducts()
  }

  get products$(): Observable<Product[]> {
    return this.productsSubject.asObservable();
  }

  loadProducts(): void {
    this.getProducts().subscribe(products => {
      this.productsSubject.next(products);
    });
  }

  //api
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/items`).pipe(
      tap(x => {
        console.log(x);
      })
    )
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/items/${id}`).pipe(
      tap(x => {
        console.log(x);
      })
    )
  }

  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/items`, product).pipe(
      take(1),
      tap(x => {
        this.loadProducts()
      }
      )
    )
  }

  updateProduct(id: number, updatedProduct: Partial<Product>): Observable<Product> {
    return this.http.patch<Product>(`${this.apiUrl}/items/${id}`, updatedProduct).pipe(
      take(1),
      tap(x => {
        this.loadProducts()
      }
      )
    )
  }

  deleteProduct(id: number): Observable<null> {
    return this.http.delete<null>(`${this.apiUrl}/items/${id}`).pipe(
      take(1),
      tap(x => {
        this.loadProducts()
      }
      )
    )
  }
}