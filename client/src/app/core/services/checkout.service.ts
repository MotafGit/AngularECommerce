import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Delivery } from '../../models/delivery';
import { map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  baseUrl = environment.apiUrl
  private http = inject(HttpClient)
  delivery: Delivery[] = []

  getDeliveries(){
    if (this.delivery.length > 0) return of (this.delivery)
    return this.http.get<Delivery[]>(this.baseUrl + 'payment/delivery').pipe(
    map(methods => {
      this.delivery = methods.sort((a,b) => b.price - a.price)
      return methods
    }))
  }
}
