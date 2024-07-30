import { Component, Inject, inject, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Product } from '../../core/interfaces/product.interface';
import { ProductsService } from '../../core/services/products.service';
import { Observable, tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { MatDialogTitle, MatDialogContent, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    MatCardModule, MatButtonModule, MatIcon,
    MatDialogTitle, MatDialogContent, MatInputModule,
    AsyncPipe, ReactiveFormsModule
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class FormComponent {
  productsService: ProductsService = inject(ProductsService)
  product$: Observable<Product>

  form: FormGroup = new FormGroup({
    name: new FormControl(''),
    description: new FormControl(''),
    sku: new FormControl(''),
    cost: new FormControl(''),
    // profile: new FormGroup({ //? or formArray,
    //   type: //? because I have to add fields dynamically
    // }),
  })
  
  constructor(@Inject(MAT_DIALOG_DATA) public data: { productId: number }, public dialogRef: MatDialogRef<FormComponent>) {
    this.product$ = this.productsService.getProduct(this.data.productId).pipe(
      tap(product => this.form.patchValue(product))
    );
  }

  closeDialog(){
    this.dialogRef.close()
  }
  
  deleteProduct(id: number){
    console.log('triggered');
    
    this.productsService.deleteProduct(id).pipe(
      tap(() => {
        console.log(`product deleted successfully!`);
        this.dialogRef.close()
      })
    ).subscribe()
  }
  
  ngAfterViewInit() {
    console.log(this.data.productId);
  }

}
