import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../core/interfaces/product.interface';
import { Observable, switchMap } from 'rxjs';
import { ProductsService } from '../../core/services/products.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent {
  route: ActivatedRoute = inject(ActivatedRoute)
  productsService: ProductsService = inject(ProductsService)
  product$: Observable<Product> = this.route.params.pipe(
    switchMap(params => {
      const id = params['id']
      return this.productsService.getProduct(id)
    })
  )
}
