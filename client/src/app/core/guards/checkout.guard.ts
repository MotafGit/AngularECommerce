import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AccountService } from '../services/account.service';
import { CartService } from '../services/cart.service';
import { of } from 'rxjs';
import { SnackbarService } from '../services/snackbar.service';

export const checkoutGuard: CanActivateFn = (route, state) => {
  const cartService = inject(CartService)
  const router = inject(Router)
  const snack = inject(SnackbarService)

  const itemCount = cartService.cartItemCount() ?? 0;
  if (itemCount == 0){
    snack.error("Cart is empty")
    return false;
  }
  else{
    return of(true)
  }
 
 
  return true;
};
