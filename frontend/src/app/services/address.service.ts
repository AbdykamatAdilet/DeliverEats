import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Address } from '../models/address';

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  getAddresses(): Observable<{ addresses: Address[], default_address: Address | null }> {
    return this.http.get<{ addresses: Address[], default_address: Address | null }>(
      `${this.apiUrl}/addresses/`
    ).pipe(catchError(this.handleError));
  }

  createAddress(address: Address): Observable<Address> {
    return this.http.post<Address>(`${this.apiUrl}/addresses/`, address)
      .pipe(catchError(this.handleError));
  }

  updateAddress(id: number, address: Address): Observable<Address> {
    return this.http.put<Address>(`${this.apiUrl}/addresses/${id}/`, address)
      .pipe(catchError(this.handleError));
  }

  deleteAddress(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/addresses/${id}/`)
      .pipe(catchError(this.handleError));
  }

  setDefaultAddress(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/addresses/${id}/set-default/`, {})
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      errorMessage = `Server Error: ${error.status} - ${error.message}`;
    }
    
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}