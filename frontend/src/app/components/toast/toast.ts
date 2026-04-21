import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorHandlerService, ErrorMessage } from '../../services/error-handler.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-error-message',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.html',
  styleUrls: ['./toast.css']
})
export class ErrorMessageComponent implements OnInit, OnDestroy {
  message: ErrorMessage | null = null;
  private subscription!: Subscription;

  constructor(private errorHandler: ErrorHandlerService) {}

  ngOnInit() {
    this.subscription = this.errorHandler.errors$.subscribe(msg => {
      this.message = msg;
    });
  }

  close() { this.errorHandler.clear(); }

  ngOnDestroy() { this.subscription.unsubscribe(); }

  getIcon(): string {
    if (!this.message) return '';
    const icons: Record<string,string> = { success: '✓', error: '✗', warning: '⚠', info: 'ℹ' };
    return icons[this.message.type] || 'ℹ';
  }
}