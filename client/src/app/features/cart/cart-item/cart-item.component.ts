import { Component, inject, input } from '@angular/core';
import { CartItem } from '../../../models/cart';
import { RouterLink } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { CurrencyPipe } from '@angular/common';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-cart-item',
  imports: [
    RouterLink,
    MatButton,
    MatIcon,
  ],
  templateUrl: './cart-item.component.html',
  styleUrl: './cart-item.component.scss'
})
export class CartItemComponent {
  item = input.required<CartItem>();
  cartService = inject(CartService)

  incrementQuantity(){
    this.cartService.addItemToCart(this.item())
  }

  decrementQuantity(){
    this.cartService.removeItemsFromCart(this.item().productId)
  }

  removeProduct(){
    this.cartService.removeItemsFromCart(this.item().productId, this.item().quantity)
  }
}
