import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login/`, {
      username,
      password
    }).pipe(
      tap((response: any) => {
        localStorage.setItem('access_token', response.access);
        localStorage.setItem('refresh_token', response.refresh);
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => new Error('Login failed'));
      })
    );
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  getProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/profile/`).pipe(
      catchError((error) => {
        console.error('PROFILE ERROR:', error);
        return throwError(() => error);
      })
    );
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('access');
  }
}