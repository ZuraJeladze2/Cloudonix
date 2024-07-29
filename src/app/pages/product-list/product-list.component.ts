import { Component, inject, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ProductsService } from '../../core/services/products.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Product } from '../../core/interfaces/product.interface';
import { MatButtonModule } from '@angular/material/button'
import { MatIcon } from '@angular/material/icon'
import {MatTooltipModule} from '@angular/material/tooltip'
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [MatTableModule, MatInputModule, MatPaginatorModule, MatFormFieldModule, MatSortModule, MatButtonModule, MatIcon, MatTooltipModule, RouterLink],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements AfterViewInit, OnInit {
  productsService: ProductsService = inject(ProductsService);
  products$: Observable<Product[]> = this.productsService.getProducts().pipe(
    tap(products => {
      console.table(products);
      this.dataSource.data = products;
    })
  );
  displayedColumns: string[] = ['id', 'name', 'sku', 'cost', 'actions'];
  dataSource: MatTableDataSource<Product> = new MatTableDataSource();

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