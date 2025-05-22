import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Delivery } from '../../models/delivery';
import { map, of } from 'rxjs';
import { PaymentType } from '../../models/payments';
import { FormBuilder, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  baseUrl = environment.apiUrl
  private http = inject(HttpClient)
  delivery: Delivery[] = []

  selectedType = signal<PaymentType | null>(null);

  getDeliveries(){
    if (this.delivery.length > 0) return of (this.delivery)
    return this.http.get<Delivery[]>(this.baseUrl + 'payment/delivery').pipe(
    map(methods => {
      this.delivery = methods.sort((a,b) => b.price - a.price)
      return methods
    }))
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

    creditCardForm = this.fb.group({
      cardNumber: [''],
      expireDate:[''],
      cvc:[''],
      cardHolder:['']

  })

    mbWayForm = this.fb.group({
      phoneNumber: ['', [Validators.required, Validators.maxLength(11), Validators.pattern(/^\d{3} \d{3} \d{3}$/)]]
  })

    mobilePaymentsForm = this.fb.group({
      phoneNumber: ['', [Validators.required, Validators.maxLength(11), Validators.pattern(/^\d{3} \d{3} \d{3}$/)]],
      carrier: ['']
  })


}
