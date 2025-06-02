import { Component, inject, Input, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import {MatDrawer, MatSidenavModule} from '@angular/material/sidenav';
import { AddOrEditProductComponent } from "./add-or-edit-product/add-or-edit-product.component";
import {MatTableModule} from '@angular/material/table';
import { ShopService } from '../../core/services/shop.service';
import { ShopParams } from '../../models/shopParams';
import { Pagination } from '../../models/pagination';
import { Product } from '../../models/product';
import { SnackbarService } from '../../core/services/snackbar.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-product',
  imports: [
    MatIcon,
    MatButton,
    FormsModule,
    MatSidenavModule,
    AddOrEditProductComponent,
    MatTableModule,
    MatPaginator
    

],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class ProductComponent implements OnInit {
  ngOnInit(): void {
    // if(this.shopService.types.length === 0){
    //   this.shopService.getTypes()
    //    console.log(this.shopService.types)
    // }
    this.shopParams.sort = "orderByIdDesc"
    this.shopParams.includes = "TypeNavigation,BrandNavigation"

    this.shopService.getProducts(this.shopParams).subscribe({
      next: items =>{
         this.tableProducts = items
      }
    })
  }

  productToEdit: Product | undefined = undefined

  shopParams = new ShopParams()
  tableProducts?: Pagination<Product>;
  shopService = inject(ShopService)
  snackbar = inject(SnackbarService)
  pageSizeOptions = [10, 20, 50]
  search: string = ''
  onSearchChange(){
    this.shopParams.pageNumber = 1
    this.shopService.getProducts(this.shopParams).subscribe({
      next: items =>{
      this.tableProducts = items
      }
    })
  }
 @ViewChild('drawer') drawer!: MatDrawer;

//  closeDrawer(true){
//     console.log('bla')
//     this.drawer.toggle()
//   }
  edit(object: any){
    this.productToEdit = object
    this.drawer.toggle()
  }

  addProduct(){
    this.productToEdit = undefined
    this.drawer.toggle()
  }

  createOrUpdateProductReactive(event: { product: Product; action: string}){
    if (this.tableProducts?.data) {
    console.log(event.product)
    
    
    if (event.action === 'updated') // update product
    {   
      var index = this.tableProducts.data.findIndex(x => x.id === event.product.id)
      if (index != -1) {
        // if (event.product.typeId !== event.product.typeNavigation.id){
        //   event.product.typeNavigation.typeName = 'testa'
        // }
        var data = this.tableProducts.data
        data[index] = event.product
        this.tableProducts.data = [... data]
        this.snackbar.success("Product updated")
      }
    }
    else
    {
      this.tableProducts.data = [...this.tableProducts.data, event.product]
      this.tableProducts.data.sort((a, b) => b.id! - a.id!);
      //this.tableProducts.data = [... data]
      this.snackbar.success("Product created")

    }
    this.drawer.toggle()



  }
}



  handleProductTablePageEvent(event: PageEvent){
    
    this.shopParams.pageNumber = event.pageIndex + 1
    this.shopParams.pageSize = event.pageSize
    this.shopService.getProducts(this.shopParams).subscribe({
      next: items =>{
         this.tableProducts = items
      }
    })
    
  }

displayedColumns: string[] = ['image', 'name', 'price', 'stock','type', 'brand', 'edit'];


}
