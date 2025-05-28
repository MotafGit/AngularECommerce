import { CanActivateFn, Router } from '@angular/router';
import { AccountService } from '../services/account.service';
import { inject } from '@angular/core';
import { of } from 'rxjs';
import { SnackbarService } from '../services/snackbar.service';
import { environment } from '../../../environments/environment';



export const adminGuard: CanActivateFn = (route, state) => {
  const accountService = inject(AccountService)
  const router = inject(Router)
  const snack = inject(SnackbarService)
  const email = environment.email


  const userEmail = accountService.currentUser()?.email
  if (userEmail == email){
    return of(true)

  }
  else{
    snack.error("You dont have the permissions to access this route")
    return false;
  }
 
 
  return false;
};

