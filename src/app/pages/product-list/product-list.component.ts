import { Component, inject, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { Observable, pipe, take, tap } from 'rxjs';
import { ProductsService } from '../../core/services/products.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Product } from '../../core/interfaces/product.interface';
import { MatButtonModule } from '@angular/material/button'
import { MatIcon } from '@angular/material/icon'
import { MatTooltipModule } from '@angular/material/tooltip'
import { Router, RouterLink } from '@angular/router';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormComponent } from '../../components/form/form.component';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [MatTableModule, MatInputModule, MatPaginatorModule, MatFormFieldModule, MatSortModule, MatButtonModule, MatIcon, MatTooltipModule, MatDialogModule, RouterLink],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements AfterViewInit, OnInit {
  productsService: ProductsService = inject(ProductsService);
  router: Router = inject(Router);
  products$: Observable<Product[]> = this.productsService.products$.pipe(
    tap(products => {
      console.table(products);
      this.dataSource.data = products;
    })
  )
  displayedColumns: string[] = ['id', 'name', 'sku', 'cost', 'actions'];
  dataSource: MatTableDataSource<Product> = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  readonly dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  openDialog(id?: number) {
    const dialogRef = this.dialog.open(FormComponent, {
      width: '560px',
      maxHeight: '90vh',
      data: { productId: id ?? 'no id' } // adding random string so empty modal opens without bugs for validation: !isNaN(id)
                                        // random string is definetly not a number, but empty one somehow is.
    });

    dialogRef.afterClosed().subscribe();
  }

  ngOnInit() {
    this.products$.subscribe();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  openConfirmationDialog(id: number) {
    const confirmDialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '560px',
      height: '200px',
    });

    confirmDialogRef.afterClosed().pipe(
      tap(result => {
        if (result) {
          this.productsService.deleteProduct(id).pipe(
            tap(() => {
              this.snackBar.open('Product deleted successfully!', 'dismiss', {
                duration: 1750
              });
              this.router.navigate(['/products']);
            }),
            take(1)
          ).subscribe();
        }
      }),
      take(1)
    ).subscribe();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}