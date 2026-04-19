import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface ErrorMessage {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  private errorSubject = new Subject<ErrorMessage | null>();
  errors$ = this.errorSubject.asObservable();

  showError(message: string) {
    this.errorSubject.next({ message, type: 'error' });
    setTimeout(() => this.clear(), 5000);
  }

  showSuccess(message: string) {
    this.errorSubject.next({ message, type: 'success' });
    setTimeout(() => this.clear(), 3000);
  }

  clear() {
    this.errorSubject.next(null);
  }
}