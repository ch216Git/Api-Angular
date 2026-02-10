import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CreateGift, GetGift, UpdateGift } from '../models/gift.model';

@Injectable({
  providedIn: 'root',
})
export class GiftService {
  BASE_URL = 'https://localhost:7081/api/Gift';
  BASE_URL_IMAGE = 'https://localhost:7081/api/Image';
  http: HttpClient = inject(HttpClient);
  constructor() { }

  getAllGift(): Observable<GetGift[]>{
    return this.http.get<GetGift[]>(this.BASE_URL);
  }

  getGiftById(id: number): Observable<GetGift>{
    return this.http.get<GetGift>(this.BASE_URL + '/' + id);
  }

  createGift(gift: CreateGift): Observable<GetGift>{
    return this.http.post<GetGift>(this.BASE_URL+'/Add', gift);
  }
  updateGift(gift: UpdateGift): Observable<GetGift>{
    return this.http.post<GetGift>(this.BASE_URL+'/Update', gift);
  }
  deleteGift(id: number): Observable<any>{
    return this.http.delete<any>(`${this.BASE_URL}/Delete?Id=${id}`, { responseType: 'text' as 'json' });
  }
  existsGift(name: string): Observable<GetGift[]>{
    return this.http.get<GetGift[]>(this.BASE_URL+'/Exists'+'/'+name);
  }
  uploadImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', file); // שם הפרמטר חייב להיות 'image' כמו ב-C#
  
    return this.http.post(`${this.BASE_URL_IMAGE}/upload`, formData);
  }
}
