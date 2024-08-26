import { Component, inject, Inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Product, PROFILE_TYPES, profileType } from '../../core/interfaces/product.interface';
import { ProductsService } from '../../core/services/products.service';
import { catchError, Observable, of, take, tap, throwError } from 'rxjs';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { MatDialogTitle, MatDialogContent, MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  private snackBar = inject(MatSnackBar);

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
    // check if productId is a number. using this way because if I wrote if (this.data.productId) it will be false if it's 0
    if (!isNaN(this.data.productId)) {
      this.product$ = this.productsService.getProduct(this.data.productId).pipe(
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

    const customPropertiesArray = this.customProperties;
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
    const confirmDialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '560px',
      height: '200px',
    });

    confirmDialogRef.afterClosed().pipe(
      tap(result => {
        if (result && product.id) {
          this.deleteProduct(product.id);
        }
      }),
      take(1)
    ).subscribe();
  }

  closeDialog() {
    this.dialogRef.close();
  }

  saveProduct(id?: number) {
    const rawValue = this.form.getRawValue();
    const payload: Product = {
      id: undefined,
      name: rawValue.name || undefined,
      description: rawValue.description || undefined,
      sku: rawValue.sku || undefined,
      cost: rawValue.cost || undefined,
      profile: {
        ...rawValue.profile,
      }
    };

    if (this.form.valid) {
      console.log(id);

      if (id !== undefined && !isNaN(id)) {
        this.handleUpdateProduct(id, payload);
      } else {
        this.handleCreateProduct(payload);
      }
    } else {
      const invalidControls = Object.keys(this.form.controls).filter(controlName => this.form.controls[controlName].invalid);
      console.error('Invalid controls:', invalidControls);
      this.snackBar.open('Please fill in all required fields.', 'dismiss', {
        duration: 1750
      })
    }
  }

  handleUpdateProduct(id: number, payload: Product) {
    payload.id = id;
    delete (payload as Partial<Product>).sku;
    this.productsService.updateProduct(id, payload).pipe(
      tap(x => {
        this.snackBar.open(`Product updated successfully!`, 'dismiss', {
          duration: 1750
        })
        this.dialogRef.close();
      }),
      catchError(err => {
        return throwError(() => err)
      })
    ).subscribe();
  }

  handleCreateProduct(payload: Product) {
    this.productsService.createProduct(payload).pipe(
      tap(x => {
        this.snackBar.open(`Product created successfully!`, '', {
          duration: 1750
        })
        this.dialogRef.close();
      }),
      catchError(err => {
        return throwError(() => err)
      })
    ).subscribe();
  }

  deleteProduct(id: number) {
    this.productsService.deleteProduct(id).pipe(
      tap(() => {
        this.snackBar.open('Product deleted successfully!', '', {
          duration: 1750
        })
        this.router.navigate(['/products']);
        this.dialogRef.close();
      })
    ).subscribe();
  }

  //customProperties
  get customProperties(): FormArray {
    return this.form.get('profile.customProperties') as FormArray;
  }
  addField(key: string, value: any) {
    const customProperties = this.customProperties;
    if (customProperties) {
      const newField = this.fb.group({
        key: [key],
        value: [value]
      });
      customProperties.push(newField);
    }
  }

  removeField(index: number) {
    const customProperties = this.customProperties;
    if (customProperties) {
      customProperties.removeAt(index);
    }
  }
}