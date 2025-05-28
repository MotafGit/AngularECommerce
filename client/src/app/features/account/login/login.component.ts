import { Component, inject, model, signal, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { AccountService } from '../../../core/services/account.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import {  MatDialog,MatDialogModule} from '@angular/material/dialog';
import { Product } from '../../../models/product';
import { CartItem } from '../../../models/cart';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    MatCard,
    MatFormField,
    MatInput,
    MatLabel,
    MatButton,
    MatDialogModule,
    FormsModule
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
  keepNewCart = false
  @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<any>;
  readonly dialog = inject(MatDialog);

  constructor(){
    const url = this.activatedRoute.snapshot.queryParams['returnUrl']
    if (url) this.returnUrl = url
  }

  loginForm = this.fb.group({
    email: [''],
    password:['']
  })


    async openDialog(previousCartItems : CartItem[] | undefined, cartFromBd : CartItem[] ): Promise<void> {
      return new Promise((resolve) => {
      const dialogRef = this.dialog.open(this.dialogTemplate, {
          width: '80vw',
        maxWidth: '80vw',
        data: {newCart : previousCartItems, savedCart: cartFromBd  },
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        console.log(result)
        if (result === 'old') {
          this.keepNewCart = false
        }
        if (result === 'new') {
          this.keepNewCart = true
        }
        if (result === undefined) {
          this.keepNewCart = false
        }
        

          resolve(result);
        });
      });
  }


  onSubmit(){
    this.accountService.login(this.loginForm.value).subscribe({
      next: () => {
        this.accountService.getUserInfo().subscribe({
          next:  currentUser => {
            var currentCartId = currentUser.cartID
            if (currentCartId) // if logged user already has a cart, retrieve the cart
            {
              
              if ( localStorage.getItem("cart_id") !== currentCartId && this.cartService.cart() && this.cartService.cart()!.items.length > 0){
                console.log("aflçf")
                 var auxCart = this.cartService.cart()
                  this.cartService.getCart(currentCartId).subscribe( async cart => {
                    var areTheSame = this.checkIfCartsItemsAreEqual(auxCart?.items, cart.items)

                    if(!areTheSame){
                       await this.openDialog(auxCart?.items, cart.items )
                       if(this.keepNewCart){
                          this.cartService.cart()!.items = auxCart!.items;
                          this.cartService.setCart(this.cartService.cart()!, currentUser.email)
                       }
                    }
                    console.log(auxCart);
                    console.log(cart)
                    console.log(this.cartService.cart())


                   
                  })
              }
              else{
                this.cartService.getCart(currentCartId).subscribe( async cart => {

                })
                 
              }
              localStorage.setItem("cart_id", currentCartId!)

              // this.cartService.getCart(currentCartId).subscribe( cart => {
              //   localStorage.setItem("cart_id", currentCartId!)
              // })
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

  checkIfCartsItemsAreEqual(previousCartItems : CartItem[] | undefined, cartFromBd : CartItem[] ){

    console.log(previousCartItems)

    console.log(cartFromBd)

    if (previousCartItems === undefined || previousCartItems.length != cartFromBd.length) return false

    cartFromBd.sort((a, b) => a.productId! - b.productId!);
    previousCartItems.sort((a, b) => a.productId! - b.productId!);

    for ( let i = 0; i < cartFromBd.length; i++)
    {
        if ( cartFromBd[i].productId != previousCartItems[i].productId || cartFromBd[i].quantity != previousCartItems[i].quantity) return false
    }
    console.log('true')
    return true

  }
 
}
