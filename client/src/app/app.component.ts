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
import { FooterComponent } from "./layout/footer/footer.component";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FontAwesomeModule, NgClass, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  ngOnInit() {
    // Subscribe to router events
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Scroll to top smoothly after navigation ends
        window.scrollTo({ top: 0 });
      }
    });
  }
  title = 'commerce web app';
  isSpecialComponent: any;
  homeComponent: any

   constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.homeComponent = event.url == '/';
      }
      if (event instanceof NavigationEnd) {
        this.isSpecialComponent = event.url.includes('admin');
      }

    });
  }

  
}
