import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, tap, catchError, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authTokenKey = 'authToken';
  router: Router = inject(Router);

  login(authKey: string): Observable<boolean> {
    // Double-checking the token
    if (authKey.length < 1) {
      console.error('Login failed: enter authKey');
      return of(false);
    }

    localStorage.setItem(this.authTokenKey, authKey);

    return of(true).pipe(
      tap(() => {
        this.router.navigate(['/products']);
      }),
      catchError(error => {
        console.error('Login failed', error);
        return of(false);
      }),
      take(1)
    );
  }

  getAuthToken(): string | null {
    return localStorage.getItem(this.authTokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }

  logout(): void {
    localStorage.removeItem(this.authTokenKey);
  }
}
