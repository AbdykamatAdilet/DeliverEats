import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CheckoutRequest, CheckoutResponse } from '../models/checkout';

@Injectable({ providedIn: 'root' })
export class CheckoutService {
  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  processCheckout(checkoutData: CheckoutRequest): Observable<CheckoutResponse> {
    return this.http.post<CheckoutResponse>(`${this.apiUrl}/checkout/`, checkoutData)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    const msg = error.error?.error || error.error?.message || 'Checkout failed';
    return throwError(() => ({ error: { error: msg } }));
  }
}