import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AddressService } from '../../services/address.service';
import { ErrorHandlerService } from '../../services/error-handler.service';
import { Address } from '../../models/address';
import { AddressFormComponent } from '../address-form/address-form';

@Component({
  selector: 'app-address-list',
  standalone: true,
  imports: [CommonModule, AddressFormComponent],
  templateUrl: './address-list.html',
  styleUrl: './address-list.css'
})
export class AddressListComponent implements OnInit {
  addresses: Address[] = [];
  isLoading = false;
  showAddressForm = false;
  editingAddress: Address | null = null;

  constructor(
    private addressService: AddressService,
    private errorHandler: ErrorHandlerService
  ) {}

  ngOnInit() { this.loadAddresses(); }

  loadAddresses() {
    this.isLoading = true;
    this.addressService.getAddresses().subscribe({
      next: (res) => {
        this.addresses = res.addresses;
        this.isLoading = false;
      },
      error: () => {
        this.errorHandler.showError('Failed to load addresses.');
        this.isLoading = false;
      }
    });
  }

  onAddNewAddress() {
    this.editingAddress = null;
    this.showAddressForm = true;
  }

  onEditAddress(address: Address) {
    this.editingAddress = address;
    this.showAddressForm = true;
  }

  onSetDefault(id: number) {
    this.addressService.setDefaultAddress(id).subscribe({
      next: () => {
        this.errorHandler.showSuccess('Default address updated.');
        this.loadAddresses();
      },
      error: () => this.errorHandler.showError('Failed to set default.')
    });
  }

  onDeleteAddress(id: number) {
    if (!confirm('Delete this address?')) return;
    this.addressService.deleteAddress(id).subscribe({
      next: () => {
        this.errorHandler.showSuccess('Address deleted.');
        this.loadAddresses();
      },
      error: () => this.errorHandler.showError('Failed to delete.')
    });
  }

  onAddressSaved() {
    this.showAddressForm = false;
    this.editingAddress = null;
    this.loadAddresses();
  }

  onCancelForm() {
    this.showAddressForm = false;
    this.editingAddress = null;
  }

  getAddressIcon(type: string): string {
    const icons: any = { home: '🏠', work: '💼', other: '📍' };
    return icons[type] || '📍';
  }
}