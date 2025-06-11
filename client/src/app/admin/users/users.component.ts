import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MatCell, MatHeaderCell, MatHeaderRow, MatHeaderRowDef, MatRow, MatTable, MatTableModule } from '@angular/material/table';
import { BaseParams } from '../../models/baseParams';
import { Pagination } from '../../models/pagination';
import { MatIcon } from '@angular/material/icon';
import {MatIconModule} from '@angular/material/icon';
import { CartService } from '../../core/services/cart.service';
import { Cart } from '../../models/cart';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { MatDrawer, MatDrawerContainer } from '@angular/material/sidenav';
import { CheckoutConfirmationComponent } from "../../features/checkout-confirmation/checkout-confirmation.component";
import { ItemsFinalCheckoutComponent } from "../../features/checkout-confirmation/items-final-checkout/items-final-checkout.component";
import { OrdersService } from '../../core/services/orders.service';
import { Order } from '../../models/order';
import { CompletedOrdersComponent } from "../../features/orders/completed-orders/completed-orders.component";


@Component({
  selector: 'app-users',
  imports: [
    MatTable,
    MatHeaderCell,
    MatCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatTableModule,
    MatIcon,
    MatIconModule,
    FormsModule,
    MatDrawer,
    MatDrawerContainer,
    ItemsFinalCheckoutComponent,
    CompletedOrdersComponent
],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit{
    baseUrl= environment.apiUrl
    cartService = inject(CartService)
    ordersService = inject(OrdersService)
    showCartFromUser?: Cart;
    showOrdersFromUser: any;
    private http = inject(HttpClient);
    users:any = [] 
    @ViewChild('drawer') drawer!: MatDrawer;

      orderToShow: any | undefined = undefined
    ngOnInit(): void {
      this.baseParams.sort = ''
      this.baseParams.pageNumber = 1
      this.baseParams.pageSize = 50

      this.getUsers(this.baseParams).subscribe({
        next: response => this.users = response
      })
  }


    getUsers(baseParams: BaseParams){
    let params = new HttpParams();
    if (baseParams.search.length > 0){
      params = params.append('search', baseParams.search)
    }
    if(baseParams.sort){
      params = params.append('sort', baseParams.sort);
    }
    params = params.append('pageSize', baseParams.pageSize);
    params = params.append('pageIndex', baseParams.pageNumber);

    return this.http.get<Pagination<Object>>(this.baseUrl + 'account/users', {params});
  }

  getOrders(email:string){
    this.ordersService.getOrdersFromUser(email).subscribe({

      next : response =>{ this.showOrdersFromUser = response
        this.showCartFromUser = undefined
        console.log(this.showOrdersFromUser.items)
      this.drawer.toggle(true)  
      }
    })
  }

  async openShoppingCart(id: string){
    console.log(id)
    await this.cartService.getCartToOrder(id).subscribe({
      next : response =>{ this.showCartFromUser = response
        this.showOrdersFromUser = null;
      console.log(this.showCartFromUser.items)
      this.drawer.toggle(true)  
      }
    })
    
  }

    onSearchChange(){
    this.baseParams.pageNumber = 1
    this.getUsers(this.baseParams).subscribe({
      next: response =>{
      this.users = response
      }
    })
  }

  getTotal(){
    // this.showCartFromUser.items.forEach(item => {
      
    // });
    return this.showCartFromUser ? this.showCartFromUser.items.reduce((sum, item) => sum + (item.quantity * item.price), 0) : 0
    // var subtotal = cart ? cart.items.reduce((sum, item) => sum + (item.quantity * item.price), 0) : 0
  }

    baseParams = new BaseParams();
  displayedColumns: string[] = ['user', 'address', 'actions'];


}
