import { Component, inject, Input, input } from '@angular/core';
import { StarRatingModule } from 'angular-star-rating';
import { GeneralService } from '../../../cores/service/general.service';

@Component({
  selector: 'app-user-review',
  imports: [
    StarRatingModule
  ],
  templateUrl: './user-review.component.html',
  styleUrl: './user-review.component.scss'
})
export class UserReviewComponent {
  generalService = inject(GeneralService)
  @Input() review: any
}
