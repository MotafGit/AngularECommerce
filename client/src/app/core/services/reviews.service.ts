import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root'
})
export class ReviewsService {

  baseUrl = environment.apiUrl
  private http = inject(HttpClient)
  accountService = inject(AccountService)
  createReview(review: any){
    return this.http.post(this.baseUrl + 'review/' + this.accountService.currentUser()?.email , review)
  }

  checkIfUserAlreadyHasReview(email: string, productId: number){
    return this.http.get(this.baseUrl + 'review/check/' + email + '/' + productId)

  }

}
