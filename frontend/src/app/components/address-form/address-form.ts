import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AddressService } from '../../services/address.service';
import { ErrorHandlerService } from '../../services/error-handler.service';
import { Address } from '../../models/address';

@Component({
  selector: 'app-address-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './address-form.html',
  styleUrls: ['./address-form.css']
})
export class AddressFormComponent implements OnInit {
  @Input() address: Address | null = null;
  @Output() addressSaved = new EventEmitter<void>();
  @Output() cancel       = new EventEmitter<void>();

  formData: Address = {
    address_type: 'home',
    street: '',
    building: null,
    apartment: null,
    entrance: null,
    floor: null,
    phone_number: '',
    special_instructions: '',
    is_default: false
  };

  isLoading  = false;
  isEditMode = false;

  constructor(
    private addressService: AddressService,
    private errorHandler: ErrorHandlerService
  ) {}

  ngOnInit() {
    if (this.address?.id) {
      this.isEditMode = true;
      this.formData   = { ...this.address };
    }
  }

  onSubmit() {
    if (!this.validateForm()) return;
    this.isLoading = true;

    const obs = this.isEditMode && this.formData.id
      ? this.addressService.updateAddress(this.formData.id, this.formData)
      : this.addressService.createAddress(this.formData);

    obs.subscribe({
      next: () => {
        this.errorHandler.showSuccess(this.isEditMode ? 'Address updated!' : 'Address saved!');
        this.addressSaved.emit();
        this.isLoading = false;
      },
      error: () => {
        this.errorHandler.showError('Failed to save address');
        this.isLoading = false;
      }
    });
  }

  validateForm(): boolean {
    if (!this.formData.street || this.formData.street.trim().length < 3) {
      this.errorHandler.showError('Street address is required (min 3 characters)');
      return false;
    }
    if (!this.formData.phone_number) {
      this.errorHandler.showError('Phone number is required');
      return false;
    }
    const phoneRegex = /^[\+]?[\d\s\-\(\)]{7,20}$/;
    if (!phoneRegex.test(this.formData.phone_number)) {
      this.errorHandler.showError('Please enter a valid phone number (7–20 digits)');
      return false;
    }
    return true;
  }

  onCancel() { this.cancel.emit(); }
}