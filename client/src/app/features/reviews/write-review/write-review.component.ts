import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatError, MatFormField, MatFormFieldControl, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { ReviewsService } from '../../../core/services/reviews.service';
import { AccountService } from '../../../core/services/account.service';
import { SnackbarService } from '../../../core/services/snackbar.service';
import { StarRatingComponent, StarRatingControlComponent, StarRatingModule } from 'angular-star-rating';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-write-review',
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatError,
    MatInput,
    StarRatingModule,
    MatButton
    
    
  ],
  templateUrl: './write-review.component.html',
  styleUrl: './write-review.component.scss'
})
export class WriteReviewComponent {
  reviewService = inject(ReviewsService)
  accountService = inject(AccountService)
  private snackBarService = inject(SnackbarService);


  private fb = inject(FormBuilder)
  @Input() productId?: number;
  @Output() closeAndSaveReview = new EventEmitter<{object: any, flag: boolean}>();
  @Output() closeReview = new EventEmitter<boolean>();


  reviewForm = this.fb.group({
    // myRatingControl: ['', Validators.required],
    title: [null, Validators.required],
    comment: [null,Validators.required],
    score: [null, [Validators.required]],
    userId: [null],
    productId: [null as number | null]
  })

    //   public string? Comment {get;set;}

    // public int? Score {get;set;}


    // [ForeignKey("Product")]
    // public required int ProductId {get;set;}

    // [ForeignKey("AppUser")]
    // public required string UserId {get;set;}

    // public virtual AppUser? UserNavigation { get; set; }

  onSubmit(){
    this.reviewForm.patchValue({productId: this.productId })
    console.log(this.reviewForm)
    this.reviewService.createReview(this.reviewForm.value).subscribe({
      next: response => { 
        this.snackBarService.success("Review submited")
        this.closeAndSaveReview.emit({object: response , flag: false})
      },
      error: error => this.snackBarService.error(error)
    })
  }


}
