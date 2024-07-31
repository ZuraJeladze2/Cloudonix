import { Component, inject, Inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Product, PROFILE_TYPES, profileType } from '../../core/interfaces/product.interface';
import { ProductsService } from '../../core/services/products.service';
import { catchError, Observable, of, tap, throwError } from 'rxjs';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { MatDialogTitle, MatDialogContent, MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    MatCardModule, MatButtonModule, MatIconModule,
    MatDialogTitle, MatDialogContent, MatInputModule, MatSelectModule, MatCheckboxModule,
    AsyncPipe, ReactiveFormsModule, NgFor, NgIf
  ],
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent {
  productsService: ProductsService = inject(ProductsService)
  fb: FormBuilder = inject(FormBuilder)
  dialog: MatDialog = inject(MatDialog);
  router: Router = inject(Router);
  product$: Observable<Product>
  profileTypes: readonly profileType[] = PROFILE_TYPES;

  form: FormGroup = new FormGroup({
    name: new FormControl<string>('', Validators.required),
    description: new FormControl<string>('', Validators.required),
    sku: new FormControl<string>({ value: '', disabled: true }),
    cost: new FormControl<number>(0, [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]),
    profile: new FormGroup({
      type: new FormControl<profileType>('furniture', Validators.required),
      available: new FormControl<boolean>(true),
      backlog: new FormControl<number>(0),
      customProperties: new FormArray([])
    })
  })

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { productId: number },
    public dialogRef: MatDialogRef<FormComponent>
  ) {
    if (this.data.productId) {
      this.product$ = this.productsService.getProduct(this.data.productId).pipe(
        tap(product => {
          console.log(`Product "${product.name}" loaded successfully!`, product.profile.customProperties);
        }),
        tap(product => this.patchProductValues(product)),
      );
    }
    else {
      this.product$ = of({} as Product);
      this.form.controls['sku'].enable();
    }
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

  openConfirmationDialog(product: Product) {
    console.log('openConfirmationDialog', product);
    
    const confirmDialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '560px',
      height: '200px',
      data: product
    });

    confirmDialogRef.afterClosed().pipe(
      tap(result => {
        console.log(`Dialog result: ${result}`);
        if (result) {
          this.deleteProduct(product.id);
        }
      })
    ).subscribe();
  }

  closeDialog() {
    this.dialogRef.close();
  }

  saveProduct(id?: number) {
    console.log('saveProduct', id);

    id ? this.editProduct(id) : this.createProduct();
  }

  createProduct() {
    const rawValue = this.form.getRawValue();
    const payload: Product = {
      id: Math.floor(Math.random() * 10000),
      name: rawValue.name || undefined,
      description: rawValue.description || undefined,
      sku: rawValue.sku || undefined,
      cost: rawValue.cost || undefined,
      profile: {
        ...rawValue.profile,
      }
    };

    console.log(...rawValue.profile.customProperties);
    console.log(this.customProperties.value);
    console.log(payload);

    if (this.form.valid) {
      this.productsService.createProduct(payload).pipe(
        tap(x => {
          console.log(`Product "${x.name}" created successfully!`, x.profile.customProperties);
          this.dialogRef.close();
        }),
        catchError(err => {
          console.log('hahaha error happens here!');

          return throwError(() => err)
        })
      ).subscribe();
    } else {
      // Handle invalid form case
      const invalidControls = Object.keys(this.form.controls).filter(controlName => this.form.controls[controlName].invalid);
      console.log('Form is invalid. Please fill in all required fields.');
      console.log('Invalid controls:', invalidControls);
    }
  }

  editProduct(id: number) {
    const rawValue = this.form.getRawValue();
    const payload: Partial<Product> = {
      name: rawValue.name || undefined,
      description: rawValue.description || undefined,
      cost: rawValue.cost || undefined,
      profile: {
        ...rawValue.profile,
      }
    };

    console.log(...rawValue.profile.customProperties);
    console.log(this.customProperties.value);
    console.log(payload);

    if (this.form.valid) {
      this.productsService.updateProduct(id, payload).pipe(
        tap(x => {
          console.log(`Product "${x.name}" updated successfully!`, x.profile.customProperties);
          this.dialogRef.close();
        }),
        catchError(err => {
          console.log('hahaha error happens here!');

          return throwError(() => err)
        })
      ).subscribe();
    } else {
      // Handle invalid form case
      const invalidControls = Object.keys(this.form.controls).filter(controlName => this.form.controls[controlName].invalid);
      console.log('Form is invalid. Please fill in all required fields.');
      console.log('Invalid controls:', invalidControls);
    }
  }

  deleteProduct(id: number) {
    this.productsService.deleteProduct(id).pipe(
      tap(() => {
        console.log(`Product deleted successfully!`);
        this.router.navigate(['/products']);
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
