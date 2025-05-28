import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Pagination } from '../../models/pagination';
import { Product } from '../../models/product';
import { ShopParams } from '../../models/shopParams';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  // baseUrl= 'https://localhost:5001/api/'
  baseUrl= environment.apiUrl

  private http = inject(HttpClient);
  types: string[] = [];
  brands: string[] = [];

  //getProducts(brands?: string[], types?: string[], sort?: string){
  getProducts(shopParams: ShopParams){
    let params = new HttpParams();
    
    if (shopParams.brands.length > 0) {
      params = params.append('brands', shopParams.brands.join(','));
    }
    if (shopParams.types.length > 0) {
      params = params.append('types', shopParams.types.join(','));
    }

    if (shopParams.search.length > 0){
      params = params.append('search', shopParams.search)
    }

    if(shopParams.sort){
      params = params.append('sort', shopParams.sort);
    }
    if (shopParams.includes){
      params = params.append('includes', shopParams.includes)
    }
    params = params.append('pageSize', shopParams.pageSize);
    params = params.append('pageIndex', shopParams.pageNumber);


    return this.http.get<Pagination<Product>>(this.baseUrl + 'products', {params});
  }

  getProduct (id: number) {
      return this.http.get<Product>(this.baseUrl + 'products/' + id)
  }

  getAllBrands(){
    return this.http.get<string[]>(this.baseUrl + 'brands');
  }

  getAllTypes(){
    return this.http.get<string[]>(this.baseUrl + 'types');
  }

  getBrands(){
    if (this.brands.length > 0) return;
    return this.http.get<string[]>(this.baseUrl + 'products/brands').subscribe({
      next: response => this.brands = response
    })
  }

  getTypes(){
    if (this.types.length > 0) return;
    return this.http.get<string[]>(this.baseUrl + 'products/types').subscribe({
      next: response => this.types = response
    })
  }

  createProduct(product: Product){
    return this.http.post(this.baseUrl + 'products', product)
  }

  updateProduct(product: Product){
    return this.http.put(this.baseUrl + 'products/' + product.id , product)
  }
  
}
