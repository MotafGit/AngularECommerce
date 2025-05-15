import { Component, inject } from '@angular/core';
import { ShopService } from '../../../core/services/shop.service';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../../models/product';
import { CurrencyPipe } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatDivider } from '@angular/material/divider';
import { CartService } from '../../../core/services/cart.service';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-product-details',
  imports: [
    CurrencyPipe,
    MatButton,
    MatIcon,
    MatFormField,
    MatInput,
    MatLabel,
    MatDivider,
    FormsModule
  ],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent {
  private shopService = inject(ShopService)
  private activatedRoute = inject(ActivatedRoute)
  cartService = inject(CartService)
  productDetails?: Product
  quantityInCart = 0
  quantity = 1

  ngOnInit(): void{
    this.loadProduct()
  }


  loadProduct (){
    const id = this.activatedRoute.snapshot.paramMap.get('id')
    if (!id) return
    this.shopService.getProduct(+id).subscribe({
      next: product => {
        this.productDetails = product
        this.updateQuantityInCart()
      },
      error: error => console.log(error)
    })
  }

  updateQuantityInCart(){
    this.quantityInCart= this.cartService.cart()?.items.find(x => x.productId === this.productDetails?.id)?.quantity || 0
    this.quantity = this.quantityInCart || 1
  }

  updateAddToCartButton(){
    return this.quantityInCart > 0 ? 'Update cart' : 'Add to cart'
  }

  addProduct(productToAdd: Product, quantity: number, qt: number){
    this.cartService.addItemToCart(productToAdd, quantity)
    this.updateQuantityInCart()
  }
}


