import { Component, inject, OnInit } from '@angular/core';
import { OrderSummaryComponent } from "../../shared/components/order-summary/order-summary.component";
import {MatStepperModule} from '@angular/material/stepper';
import { PaymentService } from '../../core/services/payment.service';
import { RouteConfigLoadEnd, RouterLink } from '@angular/router';
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
    PaymentTypesComponent
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
    saveAddressCheckBox = false
    aux = {};
    shippingPriceColor="bg-white"
    selectedDelivery: any
//     export type Address = {
//     line1: string
//     line2: string
//     city: string
//     district: string
//     country: string
//     postalCode: string

// }

    teste(method: any){
      console.log(method)
    }

    UpdatePrice(price: number){
      this.cartService.shippingPrice.set(price)
    }
    private fb = inject(FormBuilder)
    validationErrors?: string[]
    addressForm = this.fb.group({
      fullName: ['', Validators.required],
      country: ['',Validators.required],
      line1: ['', Validators.required ],
      line2: [''],
      city: ['', Validators.required],
      postalCode: ['', Validators.required],
      district: ['InputNotImplemented'],

    })

    setUpOrUpdatePayment(){
      return this.paymentService.createOrUpdatePaymentIntent().subscribe({
        next: () => {}
      });
    } 
    saveAddress(address: FormGroup){
      console.log(address)
      console.log(this.fb)
      
      if (JSON.stringify(this.aux) == JSON.stringify(address.value)) return

      if (this.saveAddressCheckBox){
        firstValueFrom(this.accountService.saveOrupdateAddress(address.value))
        this.aux = {...address.value};
      }
    }   




}
