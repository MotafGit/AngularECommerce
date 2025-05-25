import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { AccountService } from '../../../core/services/account.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    MatCard,
    MatFormField,
    MatInput,
    MatLabel,
    MatButton
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private fb = inject(FormBuilder)
  private accountService = inject (AccountService)
  private cartService = inject(CartService)
  private router = inject(Router)
  private activatedRoute = inject (ActivatedRoute)
  returnUrl = '/shop';

  constructor(){
    const url = this.activatedRoute.snapshot.queryParams['returnUrl']
    if (url) this.returnUrl = url
  }

  loginForm = this.fb.group({
    email: [''],
    password:['']
  })

  onSubmit(){
    this.accountService.login(this.loginForm.value).subscribe({
      next: () => {
        this.accountService.getUserInfo().subscribe({
          next: currentUser => {
            var currentCartId = currentUser.cartID
            if (currentCartId) // if logged user already has a cart, retrieve the cart
            {
              console.log("entra ca")
              console.log(currentCartId)

              this.cartService.getCart(currentCartId).subscribe( cart => {
                localStorage.setItem("cart_id", currentCartId!)
              })
            }
            else{ // otherwise create a new cart
              console.log("entra ca123")
              if (this.cartService.cart() == null)
              {
                  this.cartService.createCart();
                  
              }
              else
              {
                const currentCart = this.cartService.cart();
                if (currentCart) {
                  this.cartService.cart.set({ ...currentCart, id: "0" });
                }
                this.cartService.setCart(this.cartService.cart()!, currentUser.email)
              }
              localStorage.setItem("cart_id", '0')


             // this.cartService.setCart(this.cartService.cart()!, this.accountService.currentUser()?.email! )
               // localStorage.setItem("cart_id", this.cartService.cart()?.id!)
            }
            }
        })
       
        this.router.navigateByUrl(this.returnUrl)
      }
    })
  }
 
}
