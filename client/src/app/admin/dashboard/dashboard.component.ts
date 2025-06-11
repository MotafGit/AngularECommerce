import { Component, inject, OnInit, signal } from '@angular/core';
import { MatCard } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { OrdersService } from '../../core/services/orders.service';
import { AccountService } from '../../core/services/account.service';

@Component({
  selector: 'app-dashboard',
  imports: [
    MatCard,
    MatIcon
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

    ngOnInit() {

      if(!this.orderService.totalOrders || !this.orderService.totalRevenue){
        this.orderService.getTotalFromOrdersAndOrdersNumber().subscribe({
          next: response => {
            this.orderService.totalOrders = response.totalOrders,
            this.orderService.totalRevenue = response.totalRevenue
          }
        })
      }

      if(!this.orderService.totalProducts){
        this.orderService.getTotalProducts().subscribe({
          next: response => this.orderService.totalProducts = response
        })
      }

      if(!this.accountService.totalUsers){
        this.accountService.getTotalUsers().subscribe({
          next: response => this.accountService.totalUsers = response
        })
      }

  }
  orderService = inject(OrdersService)
  accountService = inject(AccountService)

  // totalOrders = signal<number | null>(null);
  // totalRevenue = signal<number | null>(null);
  // totalOrders = null;
  // totalRevenue = null

  
}
