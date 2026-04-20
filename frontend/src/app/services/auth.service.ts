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
    console.log('LOGIN REQUEST:', { username, password });

    return this.http.post(`${this.apiUrl}/login/`, {
      username,
      password
    }).pipe(
      tap((response: any) => {
        console.log('LOGIN RESPONSE:', response);

        if (response?.access) {
          localStorage.setItem('access_token', response.access);
          console.log('Access token saved');
        }

        if (response?.refresh) {
          localStorage.setItem('refresh_token', response.refresh);
          console.log('Refresh token saved');
        }
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('LOGIN ERROR:', error);

        let message = 'Login failed';

        if (error.status === 0) {
          message = 'Server not running or CORS issue';
        } else if (error.status === 400) {
          message = 'Invalid username or password / wrong request format';
        } else if (error.status === 404) {
          message = 'Login endpoint not found';
        }

        return throwError(() => new Error(message));
      })
    );
  }

  getProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/profile/`).pipe(
      catchError((error) => {
        console.error('PROFILE ERROR:', error);
        return throwError(() => error);
      })
    );
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('access_token');
  }
}