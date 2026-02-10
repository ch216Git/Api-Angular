import { HttpClient } from '@angular/common/http';
import {  Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
// import { BehaviorSubject } from 'rxjs';
import { AddGiftToBasket, AddPackageToBasket, CreateBasket, GetBasket, GetBasketById, RemoveGiftFromBasket, RemovePackageFromBasket } from '../models/basket.model';

@Injectable({
  providedIn: 'root',
})
export class BasketService {
  BASE_URL = 'https://localhost:7081/api/Basket';
  http: HttpClient = inject(HttpClient);
  constructor() { }
  private basketSubject =new BehaviorSubject<GetBasketById | undefined>(undefined);
  basket$ = this.basketSubject.asObservable();
  loadBasketFromServer(userId: number) {
    this.getBasketByUserId(userId).subscribe({
      next: basket => {
        this.basketSubject.next(basket); // יש סל
      },
      error: err => {
        if (err.status === 400) {
          this.basketSubject.next(undefined); // אין סל
        }
      }
    });
  }
  clearBasket() {
    this.basketSubject.next(undefined);
  }

  setBasket(basket: GetBasketById | undefined) {
    this.basketSubject.next(basket);
  }
  
  getAllGift(): Observable<GetBasket[]>{
    return this.http.get<GetBasket[]>(this.BASE_URL);
  }
  getBasketById(id: number): Observable<GetBasketById>{
    return this.http.get<GetBasketById>(this.BASE_URL + '/' + id);
  }
  getBasketByUserId(userId: number): Observable<GetBasketById>{
    return this.http.get<GetBasketById>(this.BASE_URL + '/ByUserId/' + userId);
  }
  createBasket(userId: CreateBasket): Observable<GetBasket>{
    return this.http.post<GetBasket>(this.BASE_URL+'/Add', userId);
  }
  deleteBasket(id: number): Observable<void> {
    return this.http.delete<void>(`${this.BASE_URL}/Delete?Id=${id}`, { responseType: 'text' as 'json' });
  }
   
  addGiftToBasket(addGift:AddGiftToBasket): Observable<GetBasketById>{
    return this.http.post<GetBasketById>(this.BASE_URL+'/AddGiftToBasket', addGift);
  }
  addPackageToBasket(addPackage:AddPackageToBasket): Observable<GetBasketById>{
    return this.http.post<GetBasketById>(this.BASE_URL+'/AddPackageToBasket',addPackage);
  }
  removeGiftFromBasket(removeGift: RemoveGiftFromBasket): Observable<GetBasketById>{
    return this.http.post<GetBasketById>(this.BASE_URL+'/RemoveGiftFromBasket',removeGift);
  }
  removePackageFromBasket(removePakage:RemovePackageFromBasket): Observable<GetBasketById>{
    return this.http.post<GetBasketById>(this.BASE_URL+'/RemovePackageFromBasket', removePakage);
  }
  removeAllPackagesFromBasket(removePakage:RemovePackageFromBasket): Observable<GetBasketById>{
    return this.http.post<GetBasketById>(this.BASE_URL+'/RemoveAllPackageFromBasket', removePakage);
  }
  removeAllGiftsFromBasket(removeGift: RemoveGiftFromBasket): Observable<GetBasketById>{
    return this.http.post<GetBasketById>(this.BASE_URL+'/RemoveAllGiftFromBasket', removeGift);
  }
}
