import { Component, inject } from '@angular/core';
import { PaymentService } from '../../../core/services/payment.service';
import { CheckoutService } from '../../../core/services/checkout.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatCard } from '@angular/material/card';
import { TextInputComponent } from "../../../shared/components/text-input/text-input.component";
import { MatButton } from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';


@Component({
  selector: 'app-payment-display',
  imports: [
     ReactiveFormsModule,
     MatLabel,
     MatFormField,
     MatCard,
     TextInputComponent,
     MatButton,
     MatSelectModule,
  ],
  templateUrl: './payment-display.component.html',
  styleUrl: './payment-display.component.scss'
})
export class PaymentDisplayComponent {
  checkoutService = inject(CheckoutService)
  private fb = inject(FormBuilder)

formControl: any;


}
