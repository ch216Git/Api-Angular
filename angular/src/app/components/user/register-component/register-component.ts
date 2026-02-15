import { Component, Input, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormGroup, FormControl,ReactiveFormsModule, Validators, FormsModule} from '@angular/forms';
import { createUser } from '../../../models/user.model';
import { UserService } from '../../../services/userService';
import { FloatLabel, FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-register-component',
  standalone: true,
  imports: [ToastModule,CommonModule, ReactiveFormsModule,FloatLabelModule, ButtonModule, DrawerModule, InputTextModule, FormsModule],
  templateUrl: './register-component.html',
  styleUrls: ['./register-component.scss'],
   providers: [MessageService]
})
export class RegisterComponent implements OnInit {
  constructor(private router: Router) {}
  // @Input() userService:UserService | null = null;
  userService: UserService = inject(UserService);
   private messageService = inject(MessageService);
  fromregister: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(4)]),
    password: new FormControl('',[Validators.required, Validators.minLength(4)]),
    name: new FormControl('', Validators.required),
    email: new FormControl('', Validators.email),
    phone: new FormControl('',[Validators.required, Validators.pattern('^\\+?[0-9]{10,12}$')]),
    address: new FormControl(''),
  })
  visible: boolean = false;
  ngOnInit() {
    this.visible = true;
  }
  onDrawerHide() {
  this.visible = false;
  this.router.navigate(['/']); 
}
register(){
    const newUser: createUser = this.fromregister.value as createUser;
    this.userService?.createUser(newUser).subscribe({
      next: (user) => {
        console.log('User registered successfully:', user);
        this.messageService.add({ severity: 'success', summary: 'הצלחה', detail: 'ההרשמה בוצעה בהצלחה!' });
        this.messageService.add({ severity: 'success', summary: 'הצלחה', detail: 'ההרשמה בוצעה בהצלחה!' });
        this.fromregister.reset();
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Error registering user:', error);
        this.messageService.add({ severity: 'error', summary: 'שגיאה', detail: 'הרשמה נכשלה. נסה שוב.' });
      }
    });
  }

}
