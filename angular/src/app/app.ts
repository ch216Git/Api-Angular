import { Component, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { User } from './components/user/userComponent';
import { UploadComponent } from './components/upload-component/upload-component';
import { GiftComponent } from './components/gift/gift-component/gift-component';
import { HeaderComponent } from './components/header-component/header-component';
import { BasketComponent } from './components/basket/basket-component/basket-component';
import { jwtDecode } from 'jwt-decode';
import { MyDecodedToken } from './models/basket.model';
import { BasketService } from './services/basket-service';


@Component({
  selector: 'app-root',
  imports: [RouterModule,HeaderComponent,BasketComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  basketService = inject(BasketService);

ngOnInit() {
  const token = localStorage.getItem('token');

  if (!token) return;

  // בדיקה בסיסית של JWT
  if (token.split('.').length !== 3) {
    console.error('Invalid JWT token:', token);
    localStorage.removeItem('token');
    return;
  }

  try {
    const decoded = jwtDecode<MyDecodedToken>(token);
    const userId = Number(decoded.id);
    this.basketService.loadBasketFromServer(userId);
  } catch (e) {
    console.error('JWT decode failed', e);
    localStorage.removeItem('token');
  }
}


  protected readonly title = signal('ChineseSale');
}
