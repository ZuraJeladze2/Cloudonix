import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../core/interfaces/product.interface';
import { Observable, switchMap } from 'rxjs';
import { ProductsService } from '../../core/services/products.service';
import { AsyncPipe, JsonPipe } from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button'
import {MatIcon} from '@angular/material/icon'
import { MatDialog } from '@angular/material/dialog';
import { FormComponent } from '../../components/form/form.component';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [AsyncPipe, MatCardModule, MatIcon, MatButtonModule, JsonPipe],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent {
  route: ActivatedRoute = inject(ActivatedRoute)
  productsService: ProductsService = inject(ProductsService)
  readonly dialog = inject(MatDialog);
  
  
  product$: Observable<Product> = this.route.params.pipe(
    switchMap(params => {
      const id = params['id']
      return this.productsService.getProduct(id)
    })
  )


  openDialog(id?: number) {
    const dialogRef = this.dialog.open(FormComponent, {
      width: '560px',
      maxHeight: '90vh',
      data: id ? { productId: id } : {}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
