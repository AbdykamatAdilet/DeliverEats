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
    templateUrl: './address-form.component.html',
    styleUrls: ['./address-form.component.css']
})
export class AddressFormComponent implements OnInit {
    @Input() address: Address | null = null;
    @Output() addressSaved = new EventEmitter<void>();
    @Output() cancel = new EventEmitter<void>();

    formData: Address = {
        address_type: 'home',
        street: '',
        building: '',
        apartment: '',
        entrance: '',
        floor: '',
        phone_number: '',
        special_instructions: '',
        is_default: false
    };

    isLoading = false;
    isEditMode = false;

    constructor(
        private addressService: AddressService,
        private errorHandler: ErrorHandlerService
    ) {}

    ngOnInit() {
        if (this.address && this.address.id) {
            this.isEditMode = true;
            this.formData = { ...this.address };
        }
    }

    onSubmit() {
        if (!this.validateForm()) {
            return;
        }

        this.isLoading = true;

        if (this.isEditMode && this.formData.id) {
            this.addressService.updateAddress(this.formData.id, this.formData).subscribe({
                next: () => {
                    this.errorHandler.showSuccess('Address updated successfully');
                    this.addressSaved.emit();
                    this.isLoading = false;
                },
                error: () => {
                    this.errorHandler.showError('Failed to update address');
                    this.isLoading = false;
                }
            });
        } else {
            this.addressService.createAddress(this.formData).subscribe({
                next: () => {
                    this.errorHandler.showSuccess('Address saved successfully');
                    this.addressSaved.emit();
                    this.isLoading = false;
                },
                error: () => {
                    this.errorHandler.showError('Failed to save address');
                    this.isLoading = false;
                }
            });
        }
    }

    validateForm(): boolean {
        if (!this.formData.street || this.formData.street.trim().length < 3) {
            this.errorHandler.showError('Street address is required (minimum 3 characters)');
            return false;
        }
        if (!this.formData.building) {
            this.errorHandler.showError('Building number is required');
            return false;
        }
        if (!this.formData.phone_number) {
            this.errorHandler.showError('Phone number is required');
            return false;
        }
        const phoneRegex = /^\+7\(\d{3}\)-\d{3}-\d{2}-\d{2}$/;
        if (!phoneRegex.test(this.formData.phone_number)) {
            this.errorHandler.showError('Phone number must be in format: +7(XXX)-XXX-XX-XX');
            return false;
        }
        return true;
    }

    onCancel() {
        this.cancel.emit();
    }
}