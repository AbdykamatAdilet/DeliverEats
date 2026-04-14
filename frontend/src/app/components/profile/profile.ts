import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class ProfileComponent implements OnInit {
  user: any = null;

  constructor(
    private authService: AuthService,
    private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit() {
    this.authService.getProfile().subscribe({
      next: (data: any) => {
        console.log('Final Check - Data from API:', data);
        this.user = data; 
        this.cdr.detectChanges(); 
      },
      error: (err: any) => {
        console.error('API Error:', err);
      }
    });
  }
}