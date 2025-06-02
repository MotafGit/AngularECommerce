import { Component, Input } from '@angular/core';
import { MatCard } from '@angular/material/card';

@Component({
  selector: 'app-completed-orders',
  imports: [
    MatCard
  ],
  templateUrl: './completed-orders.component.html',
  styleUrl: './completed-orders.component.scss'
})
export class CompletedOrdersComponent {


    @Input() showOrdersFromUser?: any
}
