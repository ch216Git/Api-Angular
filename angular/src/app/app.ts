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
import { Router } from '@angular/router';
import { ToastModule } from 'primeng/toast';

import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-root',
  imports: [ToastModule,RouterModule,HeaderComponent,BasketComponent,CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  providers: [MessageService]
})
export class App {
  basketService = inject(BasketService);
  out() {
    const a=localStorage.getItem('token');
    console.log(a);
    localStorage.removeItem('token');
    this.basketService.clearBasket();
  }

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
     console.log(decoded.role);
    this.basketService.loadBasketFromServer(userId);
  } catch (e) {
    console.error('JWT decode failed', e);
    localStorage.removeItem('token');
  }
}
 private messageService = inject(MessageService);

  protected readonly title = signal('ChineseSale');
  constructor(private router: Router) {}
  isLoginPage(): boolean {
    return this.router.url === '/login';
  }
}
