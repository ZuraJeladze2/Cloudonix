import { Routes } from '@angular/router';

// loadComponent: () => import('./pages/user-create/user-create.component').then(x => x.UserCreateComponent)
export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./pages/login/login.component').then(x => x.LoginComponent) },
  { path: 'products', loadComponent: () => import('./pages/product-list/product-list.component').then(x => x.ProductListComponent) },
  { path: 'products/:id', loadComponent: () => import('./pages/product-details/product-details.component').then(x => x.ProductDetailsComponent) },
  { path: '**', redirectTo: '/login' }
];