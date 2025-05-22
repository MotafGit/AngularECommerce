import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, Signal, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { User } from '../../../models/user';
import { map, of, tap } from 'rxjs';
import { PaymentType } from '../../../models/payments';
import { TextInputComponent } from "../../../shared/components/text-input/text-input.component";
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCreditCard, faMoneyBill1, } from '@fortawesome/free-regular-svg-icons';
import { faBuildingColumns, faMobileScreen } from '@fortawesome/free-solid-svg-icons';
import { faGooglePay, faApplePay, faApple, faGoogle, } from '@fortawesome/free-brands-svg-icons';
import { CheckoutService } from '../../../core/services/checkout.service';


@Component({
  selector: 'app-payment-types',
  imports: [
    FontAwesomeModule,
    MatRadioGroup,
    CommonModule,
    MatRadioButton,
  ],
  templateUrl: './payment-types.component.html',
  styleUrl: './payment-types.component.scss'
})
export class PaymentTypesComponent implements OnInit{
    
  ngOnInit(): void {
    console.log('yoyo')
    this.getPayments().subscribe();
    console.log(this.paymentTypes)
  }
  baseUrl = environment.apiUrl
  private http = inject(HttpClient)
  checkoutService = inject(CheckoutService)
  paymentTypes: PaymentType[] = []

  paymentIcons = 
  [
    {id: 1, icon: faCreditCard},
    {id: 2,icon: faApple},
    {id: 3,icon: faGoogle},
    {id: 4,icon: faMobileScreen},
    {id: 5,icon: faMoneyBill1},
    {id: 6,icon: faMobileScreen}
  ]

 
//       // Store the fetched payment types
//       this.paymentTypes = paymentTypes;

//       // Merge with paymentIcons based on matching id
//       const mergedPayments = this.paymentIcons.map(icon => {
//         // Find the corresponding paymentType
//         const paymentType = this.paymentTypes.find(pt => pt.id === icon.id);
//         if (paymentType) {
//           // Merge properties
//           return {
//             ...paymentType,
//             icon: icon.icon
//           };
//         }

//         return {
//           id: icon.id,
//           paymentName: 'Unknown', // or handle differently
//           icon: icon.icon
//         };
//       });

//       // Save the merged list
//       this.paymentTypes = mergedPayments;

//       return this.paymentTypes;
//     })
//   );
// }

// const people = [{id:1, name:"John"}, {id:2, name:"Alice"}];
// const address = [{id:1, peopleId: 1, address: 'Some street 1'}, {id:2, peopleId: 2, address: 'Some street 2'}]

// let op = people.map((e,i)=>{
//   let temp = address.find(element=> element.id === e.id)
//   if(temp.address) {
//     e.address = temp.address;
//   }
//   return e;
// })
// console.log(op);

   getPayments(){
    console.log(this.paymentTypes)
   if (this.paymentTypes.length > 0) return of(this.paymentTypes)
    return this.http.get<PaymentType[]>(this.baseUrl + 'payment/paymentTypes').pipe(
      map ( (pt) => {
        let mappedObj = pt.map(pay => {
          let findEl = this.paymentIcons.find(element => element.id === pay.id)
          if(findEl)
           return {
            ...pay,
            icon: findEl.icon
          };
          return {...pay}

        });
      this.paymentTypes = mappedObj;
      console.log(this.paymentTypes)
      return this.paymentTypes;
    })
)}





}













