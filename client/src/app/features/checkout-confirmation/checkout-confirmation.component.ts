import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { SharedServices } from '../../core/services/shared.service';
import { CheckoutService } from '../../core/services/checkout.service';
import { CartService } from '../../core/services/cart.service';
import { ItemsFinalCheckoutComponent } from "./items-final-checkout/items-final-checkout.component";

@Component({
  selector: 'app-checkout-confirmation',
  imports: [
    MatCard,
    MatButton,
    ItemsFinalCheckoutComponent
],
  templateUrl: './checkout-confirmation.component.html',
  styleUrl: './checkout-confirmation.component.scss'
})
export class CheckoutConfirmationComponent {
      checkoutService = inject(CheckoutService)
      cartService = inject(CartService)

      
      parseCreditCard(creditCard: string | null | undefined){
        if (!creditCard) return ''

        const noSpaces = creditCard.replace(/\s+/g, '');
        return noSpaces.slice(0, 4) + ' ' + 
          noSpaces.slice(4, 8) + ' ' +
          noSpaces.slice(8, 12) + ' ' +
          noSpaces.slice(12, 16) 

      }
}
