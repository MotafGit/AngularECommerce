import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  parseDate (date: string){
    const year = date.substring(0, 4);    
  const month = date.substring(5, 7);   
  const day = date.substring(8, 10);     

  return`${day}/${month}/${year}`;

  }
}
