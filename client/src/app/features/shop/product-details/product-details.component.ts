import { Component, inject, Input } from '@angular/core';
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
import { AccountService } from '../../../core/services/account.service';
import { UserReviewComponent } from "../../reviews/user-review/user-review.component";
import { WriteReviewComponent } from "../../reviews/write-review/write-review.component";
import { StarRatingModule, StarRatingConfigService, StarRatingComponent } from 'angular-star-rating';
import { ReviewsService } from '../../../core/services/reviews.service';
import { SnackbarService } from '../../../core/services/snackbar.service';


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
    FormsModule,
    UserReviewComponent,
    WriteReviewComponent,
    StarRatingModule,
    
],
  providers:[
    StarRatingConfigService,
  ],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent {
  private shopService = inject(ShopService)
  private activatedRoute = inject(ActivatedRoute)
  private accountService = inject(AccountService)
  private reviewService = inject(ReviewsService)
  private snackbarService = inject(SnackbarService)
  cartService = inject(CartService)
  productDetails?: Product
  quantityInCart = 0
  quantity = 1
  writeReview = false


  ngOnInit(): void{
    this.loadProduct()
  }


  loadProduct (){
    const id = this.activatedRoute.snapshot.paramMap.get('id')
    if (!id) return
    this.shopService.getProduct(+id).subscribe({
      next: response => {
        console.log(response)
        this.productDetails = response
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

  addProduct(productToAdd: Product, quantity: number){
    this.cartService.addItemToCart(productToAdd, quantity, undefined)
    this.updateQuantityInCart()
  }


  validateIfUserCanReview(productID: number){
    this.reviewService.checkIfUserAlreadyHasReview(this.accountService.currentUser()!.email, productID).subscribe({
      next: response => {
        if (response == true){ this.snackbarService.error("you already reviewed this product") }
        if (response == false) {this.writeReview = true}
      },
      error: error =>  this.snackbarService.error(error) 
    })
  }

  closeReview(event: any){
    this.writeReview = event.flag
    const aux = this.productDetails?.reviews ?? []
    const newArray = [event.object, ...aux]
    this.productDetails = {
      ...this.productDetails,
      reviews: newArray
    } as Product
    this.loadProduct ();
  }

   getHalfStarClass(rating: number): boolean {
    console.log(rating)
    const fractionalPart = rating - Math.floor(rating);
    // Consider a threshold to decide if fractional part warrants a half star
    // For example, if fractional part is between 0.25 and 0.75, show half
    return fractionalPart >= 0.25 && fractionalPart <= 0.75;
  }

}


