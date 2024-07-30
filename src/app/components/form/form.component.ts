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
    name: new FormControl<string>(''),
    description: new FormControl<string>(''),
    sku: new FormControl<string>({ value: '', disabled: true }),
    cost: new FormControl(''),
    profile: new FormGroup({
      type: new FormControl('furniture'),
      available: new FormControl<boolean>(true),
      backlog: new FormControl<number | undefined>(undefined)
    })
  })

  constructor(@Inject(MAT_DIALOG_DATA) public data: { productId: number }, public dialogRef: MatDialogRef<FormComponent>) {
    this.product$ = this.productsService.getProduct(this.data.productId).pipe(
      tap(product => this.form.patchValue(product))
    );
  }

  closeDialog() {
    this.dialogRef.close()
  }

  editProduct(id: number) {
    const rawValue = this.form.getRawValue();
    const payload: Partial<Product> = {
      name: rawValue.name || undefined,
      description: rawValue.description || undefined,
      cost: rawValue.cost || undefined,
      profile: {
        type: rawValue.profile?.type || 'furniture',
        available: rawValue.profile?.available ?? true,
        backlog: rawValue.profile?.backlog ? Number(rawValue.profile?.backlog) : undefined
      }
    };
    console.log('Payload for update:', payload);
    this.productsService.updateProduct(id, payload).pipe(
      tap(x => {
        console.log(`product "${x.name}" updated successfully!`);
        this.dialogRef.close()
      })
    ).subscribe()
  }

  deleteProduct(id: number) {
    console.log('triggered');

    this.productsService.deleteProduct(id).pipe(
      tap(() => {
        console.log(`product deleted successfully!`);
        this.dialogRef.close()
      })
    ).subscribe()
  }
}