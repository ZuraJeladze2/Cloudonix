import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environments } from '../../../environments/environments';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  apiUrl: string = environments.apiUrl
  authKey: string | null = inject(AuthService).getAuthToken()
  http: HttpClient = inject(HttpClient)

  getProducts(): Observable<any[]> {
      return this.http.get<any[]>(`${this.apiUrl}/items`);
  }
}