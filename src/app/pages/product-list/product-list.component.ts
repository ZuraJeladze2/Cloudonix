import { Component, inject, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ProductsService } from '../../core/services/products.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [MatTableModule, MatInputModule, MatPaginatorModule, MatFormFieldModule, MatSortModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements AfterViewInit, OnInit {
  productsService: ProductsService = inject(ProductsService);
  products$: Observable<any> = this.productsService.getProducts().pipe(
    tap(products => {
      console.table(products);
      this.dataSource.data = products;
    })
  );
  displayedColumns: string[] = ['id', 'name', 'sku', 'cost'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit() {
    this.products$.subscribe();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}