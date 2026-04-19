import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorHandlerService, ErrorMessage } from '../../services/error-handler.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-error-message',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './error-message.component.html',
  styleUrls: ['./error-message.component.css']
})
export class ErrorMessageComponent implements OnInit, OnDestroy {
  message: ErrorMessage | null = null;
  private subscription: Subscription;

  constructor(private errorHandler: ErrorHandlerService) {
    this.subscription = this.errorHandler.errors$.subscribe(msg => {
      this.message = msg;
      if (msg) {
        const duration = msg.type === 'success' ? 3000 : 5000;
        setTimeout(() => {
          if (this.message === msg) {
            this.close();
          }
        }, duration);
      }
    });
  }

  ngOnInit() {}

  close() {
    this.errorHandler.clear();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getIcon(): string {
    if (!this.message) return '';
    switch(this.message.type) {
      case 'success': return '✓';
      case 'error': return '✗';
      case 'warning': return '⚠';
      default: return 'ℹ';
    }
  }
}