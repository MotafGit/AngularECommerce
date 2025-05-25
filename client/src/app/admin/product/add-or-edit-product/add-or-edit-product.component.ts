import { Component, ElementRef, EventEmitter, Inject, inject, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatError, MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { TextInputComponent } from "../../../shared/components/text-input/text-input.component";
import { MatButton } from '@angular/material/button';
import { ShopService } from '../../../core/services/shop.service';
import { Product } from '../../../models/product';
import { HttpClient } from '@angular/common/http';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatOption, MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-add-or-edit-product',
  imports: [
    MatInput,
    MatFormField,
    ReactiveFormsModule,
    MatError,
    MatLabel,
    TextInputComponent,
    MatIcon,
    MatButton,
    CommonModule,
    MatSelect,
    MatOption
],
  templateUrl: './add-or-edit-product.component.html',
  styleUrl: './add-or-edit-product.component.scss'
})
export class AddOrEditProductComponent {
  private http = inject(HttpClient)
  shopService = inject(ShopService)
  @Input() productToEdit?: Product
  @Output() closeDrawerEvent = new EventEmitter<boolean>();
  @Output() createOrUpdateProductReactive = new EventEmitter<{ product: Product; action: string }>();
  @ViewChild('canvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;
  pictureUrldisabled = true



  private fb = inject(FormBuilder)
  productForm = this.fb.group({
    id: 0,
    name: ['', Validators.required],
    description: ['',Validators.required],
    price: [0.1, [Validators.required]],
    pictureUrl: ['', [Validators.required, Validators.pattern(/^https:\/\/.*\.(jpg|jpeg|png)$/i)]],
    type: ['', Validators.required],
    brand: ['', Validators.required],
    quantityInStock: [0, Validators.required],
    isProduct: true
  })

  ngOnChanges(changes: SimpleChanges): void {
    if(!this.productToEdit){
      console.log("oyoyo")
      this.productForm.reset({
        id: 0,
        name: '',
        description: '',
        price: 0.1,
        pictureUrl: '',
        type: '',
        brand: '',
        quantityInStock: 0,
        isProduct: true
      });
       this.productForm.get('pictureUrl')?.enable()
        this.updateValidator() 

      return
    }
   
    if (changes['productToEdit']) {
      this.productForm.patchValue({
      id: this.productToEdit.id,
      name: this.productToEdit.name,
      description: this.productToEdit.description,
      price: this.productToEdit.price,
      pictureUrl: this.productToEdit.pictureUrl,
      type: this.productToEdit.type,
      brand: this.productToEdit.brand,
      quantityInStock: this.productToEdit.quantityInStock,
      isProduct: true
    });
      this.productForm.get('pictureUrl')?.disable()
      this.updateValidator() 
    }
  }

  updateValidator() {
  const control = this.productForm.get('pictureUrl');
  if(control)
  {
  if (!this.productToEdit) {
    control.setValidators([Validators.required, Validators.pattern(/^https:\/\/.*\.(jpg|jpeg|png|webp)$/i)]);
  } else {
    control.setValidators([Validators.required]);
    
  }

  control.updateValueAndValidity();
  }
}

  clearUrl(){
      const control = this.productForm.get('pictureUrl');
      if(control)
      {
        control.setValidators([Validators.required, Validators.pattern(/^https:\/\/.*\.(jpg|jpeg|png)$/i)]);
        control.updateValueAndValidity();
        this.productForm.get('pictureUrl')?.enable()
        this.productForm.get('pictureUrl')?.setValue('')

      }
    }
    clearFields(){
        this.productForm.reset({
        id: 0,
        name: '',
        description: '',
        price: 0,
        pictureUrl: '',
        type: '',
        brand: '',
        quantityInStock: 0,
        isProduct: true
      });
    }
  //   t(){
  //     console.log(this.productForm.controls)
  //     console.log(this.productForm.hasError)

  //     Object.keys(this.productForm.controls).forEach(controlName => {
  //   const control = this.productForm.get(controlName);
  //   if (control)
  //   {console.log(`${controlName}:`, {
  //     valid: control.valid,
  //     invalid: control.invalid,
  //     errors: control.errors,
  //     pending: control.pending,
  //     status: control.status
  //   });}
  // });

  //   }

   onSubmit(){
    
    const product = this.productForm.getRawValue() as Product;
      if(!this.productToEdit)
      {
        this.shopService.createProduct(product).subscribe({
          next: createdProduct => this.createOrUpdateProductReactive.emit({product: createdProduct as Product,action: "created" })
        })
      }
      else{
        this.shopService.updateProduct(product).subscribe({
          next: updatedProducted => this.createOrUpdateProductReactive.emit({product: updatedProducted as Product,action: "updated"}),
          error: err => console.log(err)
        })
        
      }
      
   }


  closeDrawer() {
    this.closeDrawerEvent.emit(false);
  }


}
