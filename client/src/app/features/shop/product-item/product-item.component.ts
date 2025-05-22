import { Component, inject, Input } from '@angular/core';
import { Product } from '../../../models/product';
import { MatCard, MatCardActions, MatCardContent } from '@angular/material/card';
import { CurrencyPipe } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { ShopService } from '../../../core/services/shop.service';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { AccountService } from '../../../core/services/account.service';


@Component({
  selector: 'app-product-item',
  imports: [
    MatCard,
    MatCardContent,
    CurrencyPipe,
    MatCardActions,
    MatButton,
    MatIcon,
    RouterLink
  ],
  templateUrl: './product-item.component.html',
  styleUrl: './product-item.component.scss'
})
export class ProductItemComponent {
  private shopService = inject (ShopService)
  accountService = inject(AccountService)

  @Input() product?: Product;

  cartService = inject(CartService)

  //   getProductById(id: number){
  //   console.log("sim")
  //   this.shopService.getProduct(id);
  // }

}

 
