import { inject, Injectable } from '@angular/core';
import { CartService } from './cart.service';
import { forkJoin, of } from 'rxjs';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root'
})
export class InitService {

  private cartService = inject(CartService)
  private accountService = inject(AccountService)

  init(){
    var cartId

      cartId = localStorage.getItem('cart_id')
    

    var cart$
   //const cartId = "1"
   if(cartId !== '0')
   {
       cart$ = cartId ? this.cartService.getCart(cartId) : of(null)
   }
   else{
    cart$ = of(null)
   }

    
    
    return forkJoin({
      cart: cart$,
      user: this.accountService.getUserInfo()
    })
  }
}
