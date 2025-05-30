import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCreditCard, faMoneyBill1, } from '@fortawesome/free-regular-svg-icons';
import {  faMobileScreen } from '@fortawesome/free-solid-svg-icons';
import {  faApple, faGoogle, } from '@fortawesome/free-brands-svg-icons';
import { FooterComponent } from "../../layout/footer/footer.component";

@Component({
  selector: 'app-home',
  imports: [
    MatButton,
    RouterLink,
    FontAwesomeModule,
    FooterComponent
],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
faCreditCard: any = faCreditCard;
faApple: any = faApple;
faGoogle: any = faGoogle;
faMobileScreen: any = faMobileScreen;
faMoneyBill1: any = faMoneyBill1;

}
