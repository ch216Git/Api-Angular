import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateOrder, GetOrder, GetOrderById } from '../models/order.model';
import { GetUser } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class OrderServise {
  BASE_URL = 'https://localhost:7081/api/Order';
  http: HttpClient = inject(HttpClient);
  constructor() { }

  getAllOrder(): Observable<GetOrder[]>{
    return this.http.get<GetOrder[]>(this.BASE_URL);
  }
  getOrderById(id: number): Observable<GetOrderById>{
    return this.http.get<GetOrderById>(this.BASE_URL + '/' + id);
  }
  getOrderByUserId(userId: number): Observable<GetOrderById>{
    return this.http.get<GetOrderById>(this.BASE_URL + '/user/' + userId);
  }
   createOrder(order: CreateOrder): Observable<GetOrder>{
    return this.http.post<GetOrder>(this.BASE_URL+'/Add', order);
  }
  getBuyers(id:number):Observable<GetUser[]>{
    return this.http.get<GetUser[]>(this.BASE_URL+'/gift/'+id+'/buyers')
  }
}
