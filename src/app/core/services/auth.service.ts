import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, tap, catchError, take } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authTokenKey = 'authToken';
  private snackBar = inject(MatSnackBar);
  
  router: Router = inject(Router);

  login(authKey: string): Observable<boolean> {
    // Double-checking the token
    if (authKey.length < 1) {
      this.snackBar.open('Login failed: enter authKey', 'close', {
        duration: 2000
      });
      return of(false);
    }

    localStorage.setItem(this.authTokenKey, authKey);

    return of(true).pipe(
      tap(() => {
        this.router.navigate(['/products']);
      }),
      catchError(error => {
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
    this.router.navigate(['/login']);
  }
}
