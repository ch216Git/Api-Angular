import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CreatePackage, GetPackage, UpdatePackage } from '../models/package.model.js';


@Injectable({
  providedIn: 'root',
})
export class PackageService {
  BASE_URL = 'https://localhost:7081/api/Package';
  http: HttpClient = inject(HttpClient);
  constructor() { }

  getAllPackage(): Observable<GetPackage[]>{
    return this.http.get<GetPackage[]>(this.BASE_URL);
  }
  getPackageById(id: number): Observable<GetPackage>{
    return this.http.get<GetPackage>(this.BASE_URL + '/' + id);
  }
  createPackage(pkg: CreatePackage): Observable<GetPackage>{
    return this.http.post<GetPackage>(this.BASE_URL+'/Add', pkg);
  }
  updatePackage(pkg: UpdatePackage): Observable<GetPackage>{
    return this.http.post<GetPackage>(this.BASE_URL+'/Update', pkg);
  }
  deletePackage(id: number): Observable<any>{
    return this.http.delete<any>(this.BASE_URL+'/'+id);
  }
}
