import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ProductsService } from '../../core/services/products.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent {
  productsService: ProductsService = inject(ProductsService)
  products$: Observable<any> = this.productsService.getProducts().pipe(
    tap(x=> {
      console.log(x);
      
    })
  )
}
