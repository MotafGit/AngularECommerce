import { Component, inject, Input } from '@angular/core';
import { MatCard } from '@angular/material/card';
import { GeneralService } from '../../../cores/service/general.service';

@Component({
  selector: 'app-completed-orders',
  imports: [
    MatCard
  ],
  templateUrl: './completed-orders.component.html',
  styleUrl: './completed-orders.component.scss'
})
export class CompletedOrdersComponent {
    generalService = inject(GeneralService)

    @Input() showOrdersFromUser?: any
}
