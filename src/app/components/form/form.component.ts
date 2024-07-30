import { Component, Inject, inject, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Product } from '../../core/interfaces/product.interface';
import { ProductsService } from '../../core/services/products.service';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { MatDialogTitle, MatDialogContent, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-form',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIcon, MatDialogTitle, MatDialogContent, AsyncPipe],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class FormComponent {
  productsService: ProductsService = inject(ProductsService)
  product$: Observable<Product> 
  
  constructor(@Inject(MAT_DIALOG_DATA) public data: {productId: number}) {
    this.product$ = this.productsService.getProduct(this.data.productId)
  }
  
  ngAfterViewInit(){
    console.log(this.data.productId);
  }
  
}
