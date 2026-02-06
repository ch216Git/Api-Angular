import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { GetDonor, GetDonorById } from '../models/donor.model';

@Injectable({
  providedIn: 'root',
})
export class DonorService {
  BASE_URL = 'https://localhost:7081/api/Donor';
  http: HttpClient = inject(HttpClient);
  constructor() { }

  getAllDonor(): Observable<GetDonor[]>{
    return this.http.get<GetDonor[]>(this.BASE_URL);
  }
  getDonorById(id: number): Observable<GetDonorById>{
    return this.http.get<GetDonorById>(this.BASE_URL + '/' + id);
  }
  createDonor(donor: GetDonor): Observable<GetDonor>{
    return this.http.post<GetDonor>(this.BASE_URL+'/Add', donor);
  }
  updateDonor(donor: GetDonor): Observable<GetDonorById>{
    return this.http.post<GetDonorById>(this.BASE_URL+'/Update', donor);
  }
  deleteDonor(id: number): Observable<any>{
    return this.http.delete<any>(`${this.BASE_URL}/Delete?Id=${id}`, { responseType: 'text' as 'json' });
  }
}
