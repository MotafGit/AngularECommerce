import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { ShopService } from '../../core/services/shop.service';
import { Product } from '../../models/product';
import { MatCard } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

import { MatMenu, MatMenuTrigger } from '@angular/material/menu';


import { ProductItemComponent } from "./product-item/product-item.component";
import { FiltersDialogComponent } from './filters-dialog/filters-dialog.component';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatListOption, MatSelectionList, MatSelectionListChange } from '@angular/material/list';
import { ShopParams } from '../../models/shopParams';
import { Pagination } from '../../models/pagination';
import { FormsModule } from '@angular/forms';
import { BusyService } from '../../core/services/busy.service';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatDrawer, MatDrawerContainer } from '@angular/material/sidenav';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatCheckboxChange, MatCheckboxModule} from '@angular/material/checkbox';
import { FooterComponent } from "../../layout/footer/footer.component";
@Component({
  selector: 'app-shop',
  imports: [
    ProductItemComponent,
    MatButton,
    MatIcon,
    MatMenu,
    MatSelectionList,
    MatListOption,
    MatMenuTrigger,
    MatPaginator,
    FormsModule,
    MatDrawer,
    MatDrawerContainer,
    MatGridListModule,
    MatCheckboxModule,
    MatCard,
    FooterComponent
],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss'
})
export class ShopComponent implements OnInit {
  shopService = inject (ShopService)
  private dialogService = inject(MatDialog)
  busyService = inject(BusyService);
  selectedBrands: string[] = []
  selectedTypes: string[] = []
   @ViewChild('drawer') drawer!: MatDrawer;

  products?: Pagination<Product>;
  sortOptions = 
    [ 
      {name: 'Alphabetical', value:'name'},
      {name: 'Price: Low-High', value:'priceAsc'},
      {name: 'Price: High-Low', value:'priceDesc'}
    ]
  shopParams = new ShopParams();
  pageSizeOptions = [5, 10, 15, 20, 50]

  ngOnInit(): void {
    this.initializeShop()
  }

  initializeShop() {
    this.shopService.getBrands();
    this.shopService.getTypes();
    this.getProducts();

  }

  onSearchChange(){
    this.shopParams.pageNumber = 1
    this.getProducts();
  }

  getProducts(){
    this.shopService.getProducts(this.shopParams).subscribe({
      next: response => this.products = response,
      error: error => console.log(error),
    })
  }



  handlePageEvent(event: PageEvent){
    this.shopParams.pageNumber = event.pageIndex + 1
    this.shopParams.pageSize = event.pageSize
    this.getProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onSortChange(event: MatSelectionListChange){
    const selectedOption = event.options[0]
    if (selectedOption){
      this.shopParams.sort = selectedOption.value;
      this.getProducts();
    }
  }

  testeFilters()
  {
    this.drawer.toggle()
  }

  onCheckboxBrandChange(event: MatCheckboxChange, brand: string) {
    console.log(this.selectedBrands)
  if (event.checked) {
    this.selectedBrands.push(brand);
  } else {
    const index = this.selectedBrands.indexOf(brand);
    if (index >= 0) {
      this.selectedBrands.splice(index, 1);
    }
  }
}

  onCheckboxTypeChange(event: MatCheckboxChange, type: string) {

  if (event.checked) {
    this.selectedTypes.push(type);
  } else {
    const index = this.selectedTypes.indexOf(type);
    if (index >= 0) {
      this.selectedTypes.splice(index, 1);
    }
  }
}


  applyFilters(){
    if (this.selectedBrands.length > 0 || this.selectedTypes.length > 0)
    {
          this.shopParams.brands = this.selectedBrands;
          this.shopParams.types = this.selectedTypes;
          this.shopParams.pageNumber = 1
          this.getProducts();
          this.drawer.toggle(false)
    }
  }

  clearFilters(){
    this.selectedBrands=[];
    this.selectedTypes=[];
  }

  openFiltersDialog(){
    const dialogRef = this.dialogService.open( FiltersDialogComponent, {
      minWidth: '500px',
      data: {
       selectedBrands: this.shopParams.brands,
       selectedTypes: this.shopParams.types

      }
    });



    dialogRef.afterClosed().subscribe({
      next: result => {
        if (result) {
          this.shopParams.brands = result.selectedBrands;
          this.shopParams.types = result.selectedTypes;
          this.shopParams.pageNumber = 1
          this.getProducts();
        }
      }
    })
  }

}


