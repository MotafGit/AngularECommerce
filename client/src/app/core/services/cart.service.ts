import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Cart, CartItem } from '../../models/cart';
import { Product } from '../../models/product';
import { map } from 'rxjs';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient)
  
  shippingPrice = signal<number> (0)
  cart = signal<Cart | null>(null)
  cartItemCount = computed(() => {
    if (this.cart()?.items.length === 0 || this.cart() === null || this.cart()?.items.length === undefined ) return 0
    return this.cart()?.items.reduce((sum, item) => sum + item.quantity, 0)
  })

  totals = computed(() => {
    const cart = this.cart();
    if (!cart) return null
    const subtotal = cart ? cart.items.reduce((sum, item) => sum + (item.quantity * item.price), 0) : 0
    const shipping = this.shippingPrice();
    const discount = 0;
    
    return{
      subtotal,
      shipping,
      discount,
      total: subtotal + shipping - discount
    }
  })

  removeItemsFromCart( productId: number, quantity = 1){
    const cart = this.cart();
    if(!cart) return
    const index = cart.items.findIndex(x => x.productId === productId)
    if (index !== -1){
      if(cart.items[index].quantity > quantity){
        cart.items[index].quantity -= quantity
      }
      else{
        cart.items.splice(index, 1)
      }
      if (cart.items.length === 0){
        this.deleteCart()
      } else {
        this.setCart(cart, undefined)
      }
    }
  }

  deleteCart(){
    return this.http.delete<boolean>(this.baseUrl + 'cart?id=' + this.cart()?.id).subscribe({
      next: () => {
        localStorage.removeItem("cart_id")
        this.cart.set(null)
      }
    })
  }

  getCart(id: string){
    return this.http.get<Cart>(this.baseUrl + 'cart?id=' + id).pipe(
      map(cart => {
        this.cart.set(cart);
        return cart;
      })
    )
  }
      // return this.http.post<Cart>(this.baseUrl + 'payment/setUpPayment/' + cart.id + '/' + this.accountService.currentUser()?.email, {}).pipe(
  setCart(cart:Cart, email:string | undefined){
    console.log(email)
    return this.http.post<Cart>(this.baseUrl + 'cart' , {cart, email}).subscribe({
      next: cart => {
        this.cart.set(cart)
       // if(email != undefined){
          localStorage.setItem("cart_id", this.cart()?.id!)
       // }
      }
    })
  }

  addItemToCart(item: CartItem | Product, quantity = 1, email: string | undefined){
    console.log(item)
    const cart = this.cart() ?? this.createCart()
    console.log(cart)
    if (this.isProduct(item)){
      item = this.mapProductToCartItem(item);
      console.log(item)
    }

    cart.items = this.addOrUpdateItem(cart.items, item, quantity)
    console.log(cart)
    // if (!email) {this.cart.set(cart); return }// this is here in order to prevent an API call and create a new cart on the backend. once the user logs in, the cart will be created
    this.setCart(cart, email)
  }

  private addOrUpdateItem(items: CartItem[], item: CartItem , quantity: number): CartItem[] {
    const index = items.findIndex(x => x.productId === item.productId)
    if (quantity === 0 && index >= 0){
      items.splice(index, 1)
    }
    else if (index === -1 ){
      item.quantity = quantity
      items.push(item)
    }
    else{
      items[index].quantity += quantity;
    }
    return items
  }

  mapProductToCartItem(item: Product): CartItem  {
    return {
      productId: item.id,
      productName: item.name,
      price: item.price,
      quantity: 0,
      pictureUrl: item.pictureUrl,
      brand: item.brand,
      type: item.type
    }
  }

  private isProduct(item: CartItem | Product) : item is Product{
    return (item as Product).id !== 0
  }

  private createCart(){
    const cart = new Cart();
    localStorage.setItem('cart_id', cart.id)
    return cart
  }
}
