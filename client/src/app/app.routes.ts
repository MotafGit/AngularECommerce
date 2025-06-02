import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { ShopComponent } from './features/shop/shop.component';
import { ProductDetailsComponent } from './features/shop/product-details/product-details.component';
import { TestErrorComponent } from './test-error/test-error.component';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { ServerErrorComponent } from './shared/components/server-error/server-error.component';
import { CartComponent } from './features/cart/cart.component';
import { CheckoutComponent } from './features/checkout/checkout.component';
import { LoginComponent } from './features/account/login/login.component';
import { RegisterComponent } from './features/account/register/register.component';
import { authGuard } from './core/guards/auth.guard';
import { checkoutGuard } from './core/guards/checkout.guard';
import { AdminComponent } from './admin/admin/admin.component';
import { adminGuard } from './core/guards/admin.guard';
import { NgModule } from '@angular/core';
import { FunctionalitiesComponent } from './admin/func/functionalities/functionalities.component';
import { CheckoutSuccessComponent } from './features/checkout-confirmation/checkout-success/checkout-success.component';

export const routes: Routes = [
    {path:'', component: HomeComponent},
    {path:'shop', component: ShopComponent},
    {path:'shop/:id', component: ProductDetailsComponent},
    {path:'cart', component: CartComponent},
    {path:'checkout', component: CheckoutComponent, canActivate: [authGuard, checkoutGuard]},
    {path:'checkoutSuccess', component: CheckoutSuccessComponent},
    {path:'admin', component: AdminComponent, canActivate: [adminGuard]},
    {path:'account/login', component: LoginComponent},
    {path:'features', component: FunctionalitiesComponent},
    {path:'account/register', component: RegisterComponent},
    {path:'testError', component: TestErrorComponent},
    {path:'notfound', component: NotFoundComponent},
    {path:'servererror', component: ServerErrorComponent},
    {path:'**', redirectTo: 'notfound', pathMatch:'full'}

];


 