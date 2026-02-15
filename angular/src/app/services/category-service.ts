import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateCategory, GetCategory, GetCategoryById, UpdateCategory } from '../models/category.model';
import { CreateBasket } from '../models/basket.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  BASE_URL = 'https://localhost:7081/api/Category';
  http: HttpClient = inject(HttpClient);
  constructor() { }

  getAllCategory(): Observable<GetCategory[]>{
    return this.http.get<GetCategory[]>(this.BASE_URL);
  }
  addCategory(category: GetCategory): Observable<GetCategory>{
    return this.http.post<GetCategory>(this.BASE_URL+'/Add', category);
  }
  getCategoryById(id: number): Observable<GetCategoryById>{
    return this.http.get<GetCategoryById>(this.BASE_URL + '/' + id);
  }
  updateCategory(category: UpdateCategory): Observable<GetCategoryById>{
    return this.http.put<GetCategoryById>(this.BASE_URL+'/Update', category);
  }
  deleteCategory(id: number): Observable<any>{
    return this.http.delete<any>(`${this.BASE_URL}/Delete?Id=${id}`, { responseType: 'text' as 'json' });
  }
 createCategory(category: CreateCategory): Observable<GetCategory>{
    const token = localStorage.getItem('token') 
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });
    return this.http.post<GetCategory>(this.BASE_URL+'/Add', category, { headers });
  }
}
