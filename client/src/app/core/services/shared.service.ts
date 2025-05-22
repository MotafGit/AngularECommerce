import { inject, Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class SharedServices {

  constructor() { }

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

}
