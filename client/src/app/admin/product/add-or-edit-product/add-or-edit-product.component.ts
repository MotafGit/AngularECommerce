import { Component, ElementRef, EventEmitter, Inject, inject, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
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
export class AddOrEditProductComponent  implements OnInit {
  ngOnInit(): void {
    // if(this.shopService.types.length === 0){
    //   this.shopService.getTypes()
    //    console.log(this.shopService.types)
    // }
    this.shopService.getAllBrands().subscribe({
      next: response =>{
         this.allBrands = response
      }
    })
    this.shopService.getAllTypes().subscribe({
      next: response =>{
         this.allTypes = response
      }
    })
  }
  
  private http = inject(HttpClient)
  shopService = inject(ShopService)
  @Input() productToEdit?: Product
  @Output() closeDrawerEvent = new EventEmitter<boolean>();
  @Output() createOrUpdateProductReactive = new EventEmitter<{ product: Product; action: string }>();
  @ViewChild('canvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;
  pictureUrldisabled = true
  allBrands: any;
  allTypes: any;
  previousImgPathName: string = ""


  private fb = inject(FormBuilder)
  productForm = this.fb.group({
    id: 0,
    name: ['', Validators.required],
    description: ['',Validators.required],
    price: [0.1, [Validators.required]],
    pictureUrl: ['', [Validators.required, Validators.pattern(/^https:\/\/.*\.(jpg|jpeg|png|webp)$/i)]],
    typeId: [0, Validators.required],
    brandId: [0, Validators.required],
    quantityInStock: [0, Validators.required],
    isProduct: true,
    typeNavigation: null ,
    brandNavigation: null
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
        typeId: 0,
        brandId: 0,
        quantityInStock: 0,
        isProduct: true,
        typeNavigation: null ,
        brandNavigation: null
      });
       this.productForm.get('pictureUrl')?.enable()
        this.updateValidator() 

      return
    }
   
    if (changes['productToEdit']) {
      console.log(this.productToEdit)
      this.productForm.patchValue({
      id: this.productToEdit.id,
      name: this.productToEdit.name,
      description: this.productToEdit.description,
      price: this.productToEdit.price,
      pictureUrl: this.productToEdit.pictureUrl,
      typeId: this.productToEdit.typeId,
      brandId: this.productToEdit.brandId,
      quantityInStock: this.productToEdit.quantityInStock,
      isProduct: true,
      typeNavigation: this.productToEdit.typeNavigation,
      brandNavigation: this.productToEdit.brandNavigation,
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
        this.previousImgPathName =  this.productForm.get('pictureUrl')?.getRawValue()
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
        typeId: null,
        brandId: null,
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
    console.log(product)
      if(!this.productToEdit)
      {
        this.shopService.createProduct(product).subscribe({
          next: createdProduct => this.createOrUpdateProductReactive.emit({product: createdProduct as Product,action: "created"})
        })
      }
      else{
        this.shopService.updateProduct(product, this.previousImgPathName).subscribe({
          next: updatedProducted => this.createOrUpdateProductReactive.emit({product: updatedProducted as Product,action: "updated"}),
          error: err => console.log(err)
        })
        
      }
      
   }


  closeDrawer() {
    this.closeDrawerEvent.emit(false);
  }


}
