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
import { UserService } from './services/userService';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ToastModule,RouterModule,HeaderComponent,BasketComponent,CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  providers: [MessageService]
})
export class App {
  basketService = inject(BasketService);
    userService = inject(UserService);
  out() {
    const a=localStorage.getItem('token');
    console.log(a);
    localStorage.removeItem('token');
    this.basketService.clearBasket();
  }

ngOnInit() {
  let token = localStorage.getItem('token');

  // טוקן שפג תוקפו או לא תקין: מוחקים
  if (token) {
    try {
      const exp = jwtDecode<any>(token).exp;
      if (exp && exp * 1000 < Date.now()) {
        localStorage.removeItem('token');
        token = null;
      }
    } catch {
      localStorage.removeItem('token');
      token = null;
    }
  }

  if (!token) {
    this.tryDemoLogin();
    return;
  }

  // בדיקה בסיסית של JWT
  if (token.split('.').length !== 3) {
    console.error('Invalid JWT token:', token);
    localStorage.removeItem('token');
    return;
  }

  try {
    const decoded = jwtDecode<MyDecodedToken>(token);
    const role = decoded.role;
    const userId = Number(decoded.id);
     console.log(role);
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

    private tryDemoLogin(attempt = 1) {
    this.userService.demoLogin().subscribe({
      next: (res) => {
        if (res?.token) {
          localStorage.setItem('token', res.token);
          window.location.reload();
        }
      },
      error: () => {
        // השרת אולי עדיין מתעורר: מנסים שוב כל 8 שניות, עד 8 פעמים
        if (attempt < 8) {
          setTimeout(() => this.tryDemoLogin(attempt + 1), 8000);
        }
      }
    });
  }
  
}