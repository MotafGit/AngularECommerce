import { Component, inject, Input } from '@angular/core';
import { MatCard } from '@angular/material/card';
import { CartService } from '../../../core/services/cart.service';
import { Cart } from '../../../models/cart';

@Component({
  selector: 'app-items-final-checkout',
  imports: [
    MatCard
  ],
  templateUrl: './items-final-checkout.component.html',
  styleUrl: './items-final-checkout.component.scss'
})
export class ItemsFinalCheckoutComponent {
        cartService = inject(CartService)
        @Input() showCartFromUser?: Cart



}
