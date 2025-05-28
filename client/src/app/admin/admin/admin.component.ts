import { NgClass } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { UsersComponent } from "../users/users.component";
import { OrdersComponent } from "../orders/orders.component";
import { CartComponent } from "../../features/cart/cart.component";
import { ProductComponent } from "../product/product.component";
import { DashboardComponent } from "../dashboard/dashboard.component";
import { CartsComponent } from "../carts/carts.component";
import { MatDrawer } from '@angular/material/sidenav';

@Component({
  selector: 'app-admin',
  imports: [
    NgClass,
    MatIcon,
    UsersComponent,
    OrdersComponent,
    CartComponent,
    ProductComponent,
    DashboardComponent,
    CartsComponent
],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent {

  @ViewChild(ProductComponent) drawer!: ProductComponent;

  closeDrawer(){
    
    this.drawer?.drawer.toggle(false)
  }

  selectedItem: number = 1
  selectedDashboard = 
  [
    {
      name: 'DashBoard',
      id: 1
    },
    {
      name: 'Products',
      id: 2
    },
    {
      name: 'Users',
      id: 3
    },
    {
      name: 'Orders',
      id: 4
    },
    {
      name: 'Carts',
      id: 5
    },
  ]

}
