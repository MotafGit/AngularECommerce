import { Component, inject, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./layout/header/header.component";
import { HttpClient } from '@angular/common/http';
import { Product } from './models/product';
import { Pagination } from './models/pagination';
import { ShopService } from './core/services/shop.service';
import { ShopComponent } from "./features/shop/shop.component";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCoffee, faCreditCard } from '@fortawesome/free-solid-svg-icons';
import { faGooglePay, faApplePay } from '@fortawesome/free-brands-svg-icons';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FontAwesomeModule, NgClass],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
    ngOnInit() {
    // Redirect only on initial load
    this.router.navigate(['/shop']);
  }
  title = 'commerce web app';
  isSpecialComponent: any;

   constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isSpecialComponent = event.urlAfterRedirects.includes('admin');
      }
    });
  }

  
}
