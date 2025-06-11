import { Component, inject, Input } from '@angular/core';
import { Product } from '../../../models/product';
import { MatCard, MatCardActions, MatCardContent } from '@angular/material/card';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { ShopService } from '../../../core/services/shop.service';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { AccountService } from '../../../core/services/account.service';
import { StarRatingConfigService, StarRatingModule } from 'angular-star-rating';


@Component({
  selector: 'app-product-item',
  imports: [
    MatCard,
    MatCardContent,
    CurrencyPipe,
    MatCardActions,
    MatButton,
    MatIcon,
    RouterLink,
    CommonModule,
    StarRatingModule
],
  providers:[
    StarRatingConfigService,
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

     getHalfStarClass(rating: number): boolean {
    const fractionalPart = rating - Math.floor(rating);
    // Consider a threshold to decide if fractional part warrants a half star
    // For example, if fractional part is between 0.25 and 0.75, show half
    return fractionalPart >= 0.25 && fractionalPart <= 0.75;
  }

}

 
