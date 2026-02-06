import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { createUser, GetUser, loginUser } from '../models/user.model.js'
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  BASE_URL = 'https://localhost:7081/api/User';
  http: HttpClient = inject(HttpClient);
  constructor() { }

  getAllUser(): Observable<GetUser[]>{
    return this.http.get<GetUser[]>(this.BASE_URL);
  }

  getUserById(id: number): Observable<GetUser>{
    return this.http.get<GetUser>(this.BASE_URL + '/' + id);
  }

  createUser(user: createUser): Observable<GetUser>{
    return this.http.post<GetUser>(this.BASE_URL+'/register', user);
  }
  loginUser(user: loginUser): Observable<string>{
    return this.http.post<string>(this.BASE_URL+'/login', user);
    
  }
  
  
}
