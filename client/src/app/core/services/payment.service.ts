import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { CartService } from './cart.service';
import { Cart } from '../../models/cart';
import { map } from 'rxjs';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient)
  private cartService = inject(CartService)
  private accountService = inject(AccountService)


  createOrUpdatePaymentIntent () {
    const cart = this.cartService.cart()
    if (!cart) throw new Error("Problem with cart")
      return this.http.post<Cart>(this.baseUrl + 'payment/setUpPayment/' + cart.id + '/' + this.accountService.currentUser()?.email, {}).pipe(
        map (cart => {
          this.cartService.cart.set(cart)
          return cart
        })
      )
  }

  constructor() { }
}


