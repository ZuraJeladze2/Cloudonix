import { Component, Inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Product, PROFILE_TYPES } from '../../core/interfaces/product.interface';
import { ProductsService } from '../../core/services/products.service';
import { Observable, tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { MatDialogTitle, MatDialogContent, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { KeyValueEditorComponent } from '../key-value-editor/key-value-editor.component';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    MatCardModule, MatButtonModule, MatIconModule,
    MatDialogTitle, MatDialogContent, MatInputModule, MatSelectModule, MatCheckboxModule,
    AsyncPipe, ReactiveFormsModule,
    KeyValueEditorComponent
  ],
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent {
  product$: Observable<Product>;
  form: FormGroup;
  profileTypes = PROFILE_TYPES;

  constructor(
    private fb: FormBuilder,
    private productsService: ProductsService,
    public dialogRef: MatDialogRef<FormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { productId: number }
  ) {
    this.form = this.fb.group({
      name: [''],
      description: [''],
      sku: [{ value: '', disabled: true }],
      cost: ['', [Validators.min(0), Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      profile: this.fb.group({
        type: ['furniture'],
        available: [true],
        backlog: [null],
        customProperties: this.fb.array([])
      })
    });

    const productId = this.data.productId;

    this.product$ = this.productsService.getProduct(productId).pipe(
      tap(product => {
        console.log('Product:', product, 'form:', this.form);
      }),
      tap(product => this.patchProductValues(product))
    );
  }

  get customProperties(): FormArray {
    return this.form.get('profile.customProperties') as FormArray;
  }

  patchProductValues(product: Product) {
    const customPropertiesArray = this.form.get('profile.customProperties') as FormArray;
    customPropertiesArray.clear();

    if (product.profile.customProperties) {
      Object.entries(product.profile.customProperties).forEach(([key, value]) => {
        customPropertiesArray.push(this.fb.group({
          key: [key],
          value: [value]
        }));
      });
    }

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
        customProperties: this.mapCustomProperties(this.customProperties)
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

  updateCustomProperties(customProperties: FormArray) {
    const profileField = this.form.get('profile') as FormGroup;
    const customPropertiesValues = customProperties.value;
    profileField.patchValue({ customProperties: customPropertiesValues });
  }

  mapCustomProperties(customProperties: FormArray): { [key: string]: string } {
    const result: { [key: string]: string } = {};

    customProperties.controls.forEach(control => {
      const { key, value } = control.value;
      result[key] = value;
    });

    return result;
  }

  convertToFormArray(properties: { [key: string]: string }): FormArray {
    return this.fb.array(
      Object.entries(properties).map(([key, value]) => this.fb.group({ key, value }))
    );
  }
}
