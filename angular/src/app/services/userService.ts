import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { createUser, GetUser, loginUser } from '../models/user.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  BASE_URL = 'https://localhost:7081/api/User';
  http: HttpClient = inject(HttpClient);

  constructor() { }

  // קבלת headers עם token אם קיים
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (token) {
      return new HttpHeaders().set('Authorization', `Bearer ${token}`);
    }
    return new HttpHeaders();
  }

  // קבלת כל המשתמשים (דורש Authorize - Manager)
  getAllUser(): Observable<GetUser[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<GetUser[]>(this.BASE_URL, { headers });
  }

  // קבלת משתמש לפי ID (דורש Authorize)
  getUserById(id: number): Observable<GetUser> {
    const headers = this.getAuthHeaders();
    return this.http.get<GetUser>(`${this.BASE_URL}/${id}`, { headers });
  }

  // יצירת משתמש חדש (ללא Authorize)
  createUser(user: createUser): Observable<GetUser> {
    return this.http.post<GetUser>(`${this.BASE_URL}/register`, user);
  }

  // התחברות (ללא Authorize)
  loginUser(user: loginUser): Observable<any> {
    return this.http.post<any>(`${this.BASE_URL}/login`, user);
  }

  // עדכון משתמש (דורש Authorize)
  updateUser(user: any): Observable<GetUser> {
    const headers = this.getAuthHeaders();
    return this.http.post<GetUser>(`${this.BASE_URL}/update`, user, { headers });
  }

  // מחיקת משתמש (דורש Authorize)
  deleteUser(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete<any>(`${this.BASE_URL}/${id}`, { headers });
  }
}
