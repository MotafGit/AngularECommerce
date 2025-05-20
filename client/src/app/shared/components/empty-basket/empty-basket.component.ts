import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-empty-basket',
  imports: [
    MatIcon,
    MatButton,
    RouterLink
  ],
  templateUrl: './empty-basket.component.html',
  styleUrl: './empty-basket.component.scss'
})
export class EmptyBasketComponent {

}
