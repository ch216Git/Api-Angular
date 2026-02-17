import { Component, inject } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { loginUser } from '../../../models/user.model';
import { UserService } from '../../../services/userService';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api'; // הוספת שירות ההודעות
import { ToastModule } from 'primeng/toast'; // הוספת מודול ה-Toast
import { BasketService } from '../../../services/basket-service';
import { jwtDecode } from 'jwt-decode';
import { MyDecodedToken } from '../../../models/basket.model';

@Component({
  selector: 'app-login-component',
  standalone: true, // בהנחה שזה רכיב עצמאי
  imports: [ReactiveFormsModule, ToastModule], // הוספת ToastModule
  providers: [MessageService], // הוספת MessageService לרכיב
  templateUrl: './login-component.html',
  styleUrl: './login-component.scss',
})
export class LoginComponent {
  constructor(private router: Router, private messageService: MessageService) {}

  userService: UserService = inject(UserService);
  basketService: BasketService = inject(BasketService);

  fromlogin: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(4)]),
    password: new FormControl('', [Validators.required, Validators.minLength(4)]),
  });

  login() {
    
    if (this.fromlogin.invalid) return;

    const userLoginData: loginUser = this.fromlogin.value as loginUser;
    this.userService.loginUser(userLoginData).subscribe({
      next: (user) => {
     
        console.log('User login successfully:', user);
        localStorage.setItem('token', user.token);
          this.userService.refreshRole();
      const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode<MyDecodedToken>(token);
      this.basketService.loadBasketFromServer(Number(decoded.id));
    }
        // הודעת הצלחה
        this.messageService.add({
          severity: 'success',
          summary: 'התחברות מוצלחת',
          detail: 'ברוך השב למערכת!'
        });

        this.fromlogin.reset();
        
        // ניווט לאחר השהייה קלה כדי שהמשתמש יראה את ההודעה
        setTimeout(() => {
          this.router.navigate(['/package']);
        }, 1000);
      },
      error: (error) => {
        console.error('Error login user:', error);
        
        // הודעת שגיאה
        this.messageService.add({
          severity: 'error',
          summary: 'שגיאה בהתחברות',
          detail: 'שם משתמש או סיסמה שגויים'
        });
      }
    });
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}