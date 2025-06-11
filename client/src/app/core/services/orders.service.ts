import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Order } from '../../models/order';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient)
  //  totalOrders = signal<number | null>(null);
  // totalRevenue = signal<number | null>(null);
   totalOrders = null;
   totalRevenue = null
   totalProducts: number | null = null;

    setOrder(order:Order){
      return this.http.post<Order>(this.baseUrl + "order" , order)
    }

    getOrdersFromUser(email:string){
      return this.http.get<Order[]>(this.baseUrl + "order/" + email  )

    }

    getTotalFromOrdersAndOrdersNumber(){
      return this.http.get<any>(this.baseUrl + "order/revenueAndOrders"  )
    }

    getTotalProducts(){
      return this.http.get<number>(this.baseUrl + "products/totalProducts"  )
    }

    
  


}
