import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GetPrize } from '../models/prize.model';

@Injectable({
  providedIn: 'root',
})
export class PrizeService {
BASE_URL = 'https://localhost:7081/api/Prize';
  http: HttpClient = inject(HttpClient);
  constructor() { }

  getAllPrizes():Observable<GetPrize[]>{
    return this.http.get<GetPrize[]>(this.BASE_URL);
  }
 GetRandomPrize(id:number):Observable<GetPrize>{
    return this.http.post<GetPrize>(this.BASE_URL+'/SelectRandomPrize/'+id,null);
  }
}
