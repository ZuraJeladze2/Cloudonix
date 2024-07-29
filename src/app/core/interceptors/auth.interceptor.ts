import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authToken = inject(AuthService).getAuthToken();

  const authReq = req.clone({
    setHeaders: {
      Authorization: authToken ? `Bearer ${authToken}` : ''
    }
  });

  return next(authReq);
};