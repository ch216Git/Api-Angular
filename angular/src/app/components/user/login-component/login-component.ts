import { Component, Input, input,inject } from '@angular/core';
import {FormGroup, FormControl,ReactiveFormsModule, Validators} from '@angular/forms';
import { createUser, loginUser } from '../../../models/user.model';
import { UserService } from '../../../services/userService';
import { BasketService } from '../../../services/basket-service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login-component',
  imports: [ReactiveFormsModule],
  templateUrl: './login-component.html',
  styleUrl: './login-component.scss',
})
export class LoginComponent { 
  constructor(private router: Router) {}
  // basketService:  BasketService = inject(UserService);
  userService: UserService = inject(UserService);
  // @Input() userService:UserService | null = null;
 
  fromlogin: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(4)]),
    password: new FormControl('',[Validators.required, Validators.minLength(4)]),
  })

login(){
    const loginUser: loginUser = this.fromlogin.value as loginUser;
    this.userService?.loginUser(loginUser).subscribe({
      next: (user) => {
        console.log('User login successfully:', user);
        localStorage.setItem('token',JSON.stringify(user));
        
        this.fromlogin.reset();
        this.router.navigate(['/package'])
        // this.basketService.loadBasketForUser(user.id);
      },
      error: (error) => {
        console.error('Error login user:', error);
      }
    });
  }
  goToRegister(){
    this.router.navigate(['/register']);
  }
}
