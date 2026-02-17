import { Component, OnInit, inject, input } from '@angular/core';
import { UserService } from '../../services/userService';
import { GetUser, loginUser } from '../../models/user.model';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from './register-component/register-component';
import { LoginComponent } from './login-component/login-component';

@Component({
  selector: 'app-user',
  standalone: true,   
  imports: [CommonModule,RegisterComponent,LoginComponent],
  templateUrl: 'userComponent.html',
  styleUrls: ['./userComponent.scss']
})
export class User{
 
  userService: UserService = inject(UserService);
  listUsers: GetUser[] = [];
  userById:  GetUser | undefined;

  ngOnInit() {
     this.getAllUsers()
  }
  getAllUsers(){
    this.userService.getAllUser().subscribe(data => {
      this.listUsers = data;
      console.log(this.listUsers);
    });
  }
  getUserById(id:number){
    this.userService.getUserById(id).subscribe(data => {
      this.userById = data;
      console.log(this.userById);
      
    });
  }
}
