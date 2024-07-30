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
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
  product$: Observable<Product>;
  form: FormGroup = {} as FormGroup;
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

    this.product$ = this.productsService.getProduct(this.data.productId).pipe(
      tap(product => this.form.patchValue(product))
    );
  }

  get customProperties(): FormArray {
    return this.form.get('profile.customProperties') as FormArray;
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

    this.productsService.updateProduct(id, payload).pipe(
      tap(x => {
        console.log(`Product "${x.name}" updated successfully!`);
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
    console.log('Updating custom properties:', customProperties);
    console.log(this.form.get('profile'));
  
    const profileField = this.form.get('profile') as FormGroup;
    const customPropertiesValues = customProperties.value;
    profileField.patchValue({ customProperties: customPropertiesValues });
  }

  mapCustomProperties(customProperties: FormArray): { [key: string]: string } {
    const result: { [key: string]: string } = {};
    console.warn(customProperties);

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
