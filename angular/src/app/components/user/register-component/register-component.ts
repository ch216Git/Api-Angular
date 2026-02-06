import { Component, Input,inject } from '@angular/core';
import {FormGroup, FormControl,ReactiveFormsModule, Validators, FormsModule} from '@angular/forms';
import { createUser } from '../../../models/user.model';
import { UserService } from '../../../services/userService';
import { FloatLabel } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
@Component({
  selector: 'app-register-component',
  imports: [ReactiveFormsModule,ButtonModule,DrawerModule,FloatLabel,InputTextModule,FormsModule],
  templateUrl: './register-component.html',
  styleUrl: './register-component.scss',
})
export class RegisterComponent {
  // @Input() userService:UserService | null = null;
  userService: UserService = inject(UserService);
  fromregister: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(4)]),
    password: new FormControl('',[Validators.required, Validators.minLength(4)]),
    name: new FormControl('', Validators.required),
    email: new FormControl('', Validators.email),
    phone: new FormControl('',[Validators.required, Validators.pattern('^\\+?[0-9]{10,12}$')]),
    address: new FormControl(''),
  })
  visible: boolean = false;
  // ngonInit() {
  //   this.visible = true;
  // }
register(){
    const newUser: createUser = this.fromregister.value as createUser;
    this.userService?.createUser(newUser).subscribe({
      next: (user) => {
        console.log('User registered successfully:', user);
        this.fromregister.reset();
      },
      error: (error) => {
        console.error('Error registering user:', error);
      }
    });
  }

}
