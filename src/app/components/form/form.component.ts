import { Component, inject, Inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Product, PROFILE_TYPES, profileType } from '../../core/interfaces/product.interface';
import { ProductsService } from '../../core/services/products.service';
import { Observable, tap } from 'rxjs';
import { AsyncPipe, NgFor } from '@angular/common';
import { MatDialogTitle, MatDialogContent, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    MatCardModule, MatButtonModule, MatIconModule,
    MatDialogTitle, MatDialogContent, MatInputModule, MatSelectModule, MatCheckboxModule,
    AsyncPipe, ReactiveFormsModule, NgFor
  ],
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent {

  productsService: ProductsService = inject(ProductsService)
  product$: Observable<Product>
  profileTypes: readonly profileType[] = PROFILE_TYPES;
  fb: FormBuilder = inject(FormBuilder)


  form: FormGroup = new FormGroup({
    name: new FormControl<string>(''),
    description: new FormControl<string>(''),
    sku: new FormControl<string>({ value: '', disabled: true }),
    cost: new FormControl<number>(0),
    profile: new FormGroup({
      type: new FormControl<profileType>('furniture'),
      available: new FormControl<boolean>(true),
      backlog: new FormControl<number | undefined>(undefined),
      customProperties: new FormArray([])
    })
  })

  constructor(@Inject(MAT_DIALOG_DATA) public data: { productId: number }, public dialogRef: MatDialogRef<FormComponent>) {
    this.product$ = this.productsService.getProduct(this.data.productId).pipe(
      tap(product => {
        console.log(`Product "${product.name}" loaded successfully!`, product.profile.customProperties);
      }),
      tap(product => this.patchProductValues(product)),

    );
  }
  
  patchProductValues(product: Product) {
    this.form.patchValue({
      name: product.name,
      description: product.description,
      sku: product.sku,
      cost: product.cost,
      profile: {
        type: product.profile.type,
        available: product.profile.available,
        backlog: product.profile.backlog
      }
    });

    const customPropertiesArray = this.form.get('profile.customProperties') as FormArray;
    customPropertiesArray.clear();

    if (product.profile.customProperties) {
      Object.entries(product.profile.customProperties).forEach(([index, pair]) => {
        customPropertiesArray.push(this.fb.group({
          key: [pair.key],
          value: [pair.value]
        }));
      });
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

  editProduct(id: number) {
    const rawValue = this.form.getRawValue();
    const payload: Partial<Product> = {
      name: rawValue.name || undefined,
      description: rawValue.description || undefined,
      cost: rawValue.cost || undefined,
      profile: {
        ...rawValue.profile,
        // customProperties: this.mapCustomProperties(this.customProperties)
      }
    };

    console.log(...rawValue.profile.customProperties);
    console.log(this.customProperties.value);
    console.log(payload);



    this.productsService.updateProduct(id, payload).pipe(
      tap(x => {
        console.log(`Product "${x.name}" updated successfully!`, x.profile.customProperties);
        this.dialogRef.close();
      })
    ).subscribe();
  }

  deleteProduct(id: number) {
    this.productsService.deleteProduct(id).pipe(
      tap(() => {
        console.log(`Product deleted successfully!`);
        this.dialogRef.close();
      })
    ).subscribe();
  }




  //customProperties
  addField(key: string, value: any) {
    const customProperties = this.form.get('profile.customProperties') as FormArray;
    if (customProperties) {
      const newField = this.fb.group({
        key: [key],
        value: [value]
      });
      customProperties.push(newField);
    }
  }

  get customProperties(): FormArray {
    return this.form.get('profile.customProperties') as FormArray;
  }
  removeField(index: number) {
    const customProperties = this.form.get('profile.customProperties') as FormArray;
    if (customProperties) {
      customProperties.removeAt(index);
    }
  }

}
