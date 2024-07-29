import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, tap, catchError, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authToken: string | null = null;
  router: Router = inject(Router)

  login(authKey: string): Observable<boolean> {
    //double checking the token
    if (authKey.length < 1) {
      console.error('Login failed: enter authKey');
      return of(false); 
    }

    this.authToken = authKey;

    return of(true).pipe(
      tap(() => {
        console.log('Login successful with token:', this.authToken);
        this.router.navigate(['/products'])
      }),
      catchError(error => {
        console.error('Login failed', error);
        return of(false);
      }),
      take(1)
    );
  }
  getAuthToken(): string | null {
    return this.authToken;
  }

  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }

  logout(): void {
    this.authToken = null;
  }
}
