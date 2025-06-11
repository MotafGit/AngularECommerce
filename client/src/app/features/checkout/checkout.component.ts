import { Component, inject, OnInit } from '@angular/core';
import { OrderSummaryComponent } from "../../shared/components/order-summary/order-summary.component";
import {MatStepperModule} from '@angular/material/stepper';
import { PaymentService } from '../../core/services/payment.service';
import { RouteConfigLoadEnd, Router, RouterLink } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { TextInputComponent } from "../../shared/components/text-input/text-input.component";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {MatCheckboxChange, MatCheckboxModule} from '@angular/material/checkbox';
import { AccountService } from '../../core/services/account.service';
import { Address } from '../../models/user';
import { firstValueFrom } from 'rxjs';
import { CheckoutService } from '../../core/services/checkout.service';
import { MatRadioModule } from '@angular/material/radio';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { CartService } from '../../core/services/cart.service';
import { PaymentTypesComponent } from "../paymentMethods/payment-types/payment-types.component";
import { PaymentDisplayComponent } from "../paymentMethods/payment-display/payment-display.component";
import { CheckoutConfirmationComponent } from "../checkout-confirmation/checkout-confirmation.component";
import { SharedServices } from '../../core/services/shared.service';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { OrdersService } from '../../core/services/orders.service';
import { Order } from '../../models/order';
import { Product } from '../../models/product';


@Component({
  selector: 'app-checkout',
  imports: [
    OrderSummaryComponent,
    MatStepperModule,
    MatButton,
    RouterLink,
    TextInputComponent,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatRadioModule,
    CommonModule,
    PaymentTypesComponent,
    PaymentDisplayComponent,
    CheckoutConfirmationComponent
],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit {
method: any;
    ngOnInit(): void {
      this.checkoutService.getDeliveries().subscribe();
    }
    cartService = inject(CartService)
    paymentService = inject(PaymentService)
    accountService = inject(AccountService)
    checkoutService = inject(CheckoutService)
    orderService = inject(OrdersService)
    router = inject(Router)
    saveAddressCheckBox = false
    shippingMethodPicked = false
    showPlaceOrder = false;
    aux = {};
    order!: Order
    shippingPriceColor="bg-white"
    selectedDelivery: any
    showCheckoutConfirmation = false
//     export type Address = {
//     line1: string
//     line2: string
//     city: string
//     district: string
//     country: string
//     postalCode: string

// }



    UpdatePrice(price: number){
      this.cartService.shippingPrice.set(price)
      this.shippingMethodPicked = true;
    }
    // private fb = inject(FormBuilder)
    // validationErrors?: string[]
    // addressForm = this.fb.group({
    //   fullName: ['', Validators.required],
    //   country: ['',Validators.required],
    //   line1: ['', Validators.required ],
    //   line2: [''],
    //   city: ['', Validators.required],
    //   postalCode: ['', Validators.required],
    //   district: ['InputNotImplemented'],

    // })

    setUpOrUpdatePayment(){
      return this.paymentService.createOrUpdatePaymentIntent().subscribe({
        next: () => {}
      });
    } 
    saveAddress(address: FormGroup){
      
      if (JSON.stringify(this.aux) == JSON.stringify(address.value)) return

      if (this.saveAddressCheckBox){
        firstValueFrom(this.accountService.saveOrupdateAddress(address.value))
        this.aux = {...address.value};
      }
    }   


    onStepChange(event : StepperSelectionEvent){
      if (event.selectedIndex == 3) this.showPlaceOrder = true
      else this.showPlaceOrder = false
    }

    placeOrder(){
     
      var auxList : Product[] = []
      this.cartService.cart()!.items.forEach(item => {
        var product =
        {
          Productid: item.productId,
          name: item.productName,
          description: "",
          price: item.price,
          pictureUrl: item.pictureUrl,
          brandId: item.brandId,
          typeId: item.typeId,
          quantity: item.quantity,
          quantityInStock: 0,
          isProduct: true,
          typeNavigation: null,
          brandNavigation: null,
        }

        auxList.push(product)
        
      });
      this.order  = {
        orderPrice: this.cartService.totals()!.total,
        orderDate: undefined,
        userId: undefined,
        orderProductsNavigation: auxList
      }
      
      console.log(this.order)
       this.orderService.setOrder(this.order).subscribe({
        next: () => {
          this.showCheckoutConfirmation = true
          this.cartService.cart()!.items = []
          this.cartService.setCart(this.cartService.cart()!, this.accountService.currentUser()?.email)
          this.router.navigate(['/checkoutSuccess'])
        }
       })
      }

}
