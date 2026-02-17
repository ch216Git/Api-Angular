import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal, computed } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { AddGiftToBasket, AddPackageToBasket, CreateBasket, GetBasket, GetBasketById, RemoveGiftFromBasket, RemovePackageFromBasket } from '../models/basket.model';

@Injectable({
  providedIn: 'root',
})
export class BasketService {
  private readonly BASE_URL = 'https://localhost:7081/api/Basket';
  private readonly http = inject(HttpClient);

  // 1. הגדרת ה-Signal המרכזי של הסל (פרטי)
  private readonly basketSignal = signal<GetBasketById | undefined>(undefined);

  // 2. חשיפת הסיגנל לקריאה בלבד
  readonly basket = this.basketSignal.asReadonly();

  // 3. משתנה מחושב אוטומטית לכמות הפריטים בסל
  readonly cartItemsCount = computed(() => {
    const b = this.basketSignal();
    if (!b) return 0;
    return (b.gifts?.length || 0) + (b.packages?.length || 0);
  });

  // --- ניהול מצב (State Management) ---

  setBasket(basket: GetBasketById | undefined) {
    this.basketSignal.set(basket);
  }
  createBasket(basket: CreateBasket): Observable<GetBasketById> {
    return this.http.post<GetBasketById>(`${this.BASE_URL}/Add`, basket).pipe(
      tap(newBasket => this.setBasket(newBasket)) // עדכון הסיגנל מיד עם יצירת הסל
    );
  }
  clearBasket() {
    this.basketSignal.set(undefined);
  }

  loadBasketFromServer(userId: number) {
    this.getBasketByUserId(userId).subscribe({
      next: (basket) => this.setBasket(basket),
      error: (err) => {
        if (err.status === 400) this.clearBasket();
      }
    });
  }

  // --- פונקציות HTTP עם עדכון אוטומטי של ה-Signal ---
  // הוספנו pipe(tap(...)) כדי שהסיגנל יתעדכן ברגע שהתשובה חוזרת

addGiftToBasket(addGift: AddGiftToBasket): Observable<GetBasketById> {
  return this.http.post<GetBasketById>(`${this.BASE_URL}/AddGiftToBasket`, addGift).pipe(
    tap(updatedBasket => this.setBasket(updatedBasket)) // זה המפתח לעדכון אוטומטי של המסך
  );
}

  addPackageToBasket(addPackage: AddPackageToBasket): Observable<GetBasketById> {
    return this.http.post<GetBasketById>(`${this.BASE_URL}/AddPackageToBasket`, addPackage).pipe(
      tap(updatedBasket => this.setBasket(updatedBasket))
    );
  }

  removeGiftFromBasket(removeGift: RemoveGiftFromBasket): Observable<GetBasketById> {
    return this.http.post<GetBasketById>(`${this.BASE_URL}/RemoveGiftFromBasket`, removeGift).pipe(
      tap(updatedBasket => this.setBasket(updatedBasket))
    );
  }

  removePackageFromBasket(removePackage: RemovePackageFromBasket): Observable<GetBasketById> {
    return this.http.post<GetBasketById>(`${this.BASE_URL}/RemovePackageFromBasket`, removePackage).pipe(
      tap(updatedBasket => this.setBasket(updatedBasket))
    );
  }

  removeAllPackagesFromBasket(removePackage: RemovePackageFromBasket): Observable<GetBasketById> {
    return this.http.post<GetBasketById>(`${this.BASE_URL}/RemoveAllPackageFromBasket`, removePackage).pipe(
      tap(updatedBasket => this.setBasket(updatedBasket))
    );
  }

  removeAllGiftsFromBasket(removeGift: RemoveGiftFromBasket): Observable<GetBasketById> {
    return this.http.post<GetBasketById>(`${this.BASE_URL}/RemoveAllGiftFromBasket`, removeGift).pipe(
      tap(updatedBasket => this.setBasket(updatedBasket))
    );
  }

  // פונקציות עזר כלליות
  getBasketByUserId(userId: number): Observable<GetBasketById> {
    return this.http.get<GetBasketById>(`${this.BASE_URL}/ByUserId/${userId}`);
  }

  deleteBasket(id: number): Observable<void> {
    return this.http.delete<void>(`${this.BASE_URL}/Delete?Id=${id}`, { responseType: 'text' as 'json' });
  }
}