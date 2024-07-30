import { Component, Inject, inject, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Product, PROFILE_TYPES, profileType } from '../../core/interfaces/product.interface';
import { ProductsService } from '../../core/services/products.service';
import { Observable, of, tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { MatDialogTitle, MatDialogContent, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { KeyValueEditorComponent } from "../key-value-editor/key-value-editor.component";

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    MatCardModule, MatButtonModule, MatIcon,
    MatDialogTitle, MatDialogContent, MatInputModule, MatSelectModule, MatCheckboxModule,
    AsyncPipe, ReactiveFormsModule,
    KeyValueEditorComponent
],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class FormComponent {
  productsService: ProductsService = inject(ProductsService)
  product$: Observable<Product>
  profileTypes: readonly profileType[] = PROFILE_TYPES;


  form: FormGroup = new FormGroup({
    name: new FormControl<string>(''),
    description: new FormControl<string>(''),
    sku: new FormControl<string>({ value: '', disabled: true }),
    cost: new FormControl<number>(0),
    profile: new FormGroup({
      type: new FormControl<profileType>('furniture'),
      available: new FormControl<boolean>(true),
      backlog: new FormControl<number | undefined>(undefined),
      customProperties: new FormGroup({})
    })
  })

  constructor(@Inject(MAT_DIALOG_DATA) public data: { productId: number }, public dialogRef: MatDialogRef<FormComponent>) {
    if (this.data.productId) {
      this.product$ = this.productsService.getProduct(this.data.productId).pipe(
        tap(product => this.form.patchValue(product))
      );
    }
    else {
      this.product$ = of({
        id: 0,
        name: '',
        description: '',
        sku: '',
        cost: 0,
        profile: {
          type: 'furniture',
          available: true,
          backlog: undefined
        }
      })
    }

  }

  closeDialog() {
    this.dialogRef.close()
  }

  createProduct() {
    const rawValue = this.form.getRawValue();
    const payload: Product = {
      id: 0,
      name: rawValue.name,
      description: rawValue.description,
      sku: rawValue.sku,
      cost: rawValue.price,
      profile: {
        type: rawValue.profile?.type || 'furniture',
        available: rawValue.profile?.available !== undefined ? rawValue.profile?.available : true,
        backlog: rawValue.profile?.backlog ? Number(rawValue.profile?.backlog) : undefined,
        ...rawValue.profile?.customProperties
      }
    };

    console.log('Payload for creation:', payload);

    this.productsService.createProduct(payload).pipe(
      tap(x => {
        console.log(`Product "${x.name}" created successfully!`);
        this.dialogRef.close();
      })
    ).subscribe();
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




