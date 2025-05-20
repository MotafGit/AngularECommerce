import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { User } from '../../../models/user';
import { map, of, tap } from 'rxjs';
import { PaymentType } from '../../../models/payments';

@Component({
  selector: 'app-payment-types',
  imports: [],
  templateUrl: './payment-types.component.html',
  styleUrl: './payment-types.component.scss'
})
export class PaymentTypesComponent implements OnInit{
  ngOnInit(): void {
    console.log('yoyo')
    this.getPayments().subscribe();


        // this.http.get<PaymentType>(this.baseUrl + 'payment/paymentTypes').subscribe({
        //   next: response => {this.paymentTypes = response; console.log(this.paymentTypes);}
        // })
    console.log(this.paymentTypes)
  }
  baseUrl = environment.apiUrl
  private http = inject(HttpClient)
  paymentTypes: PaymentType[] = []

  getPayments(){
   if (this.paymentTypes.length > 0) return of(this.paymentTypes)
    return this.http.get<PaymentType[]>(this.baseUrl + 'payment/paymentTypes').pipe(
      map ( mm => {
        console.log(mm)
        this.paymentTypes = mm
        return mm
      }))
  }

}













