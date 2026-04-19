import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AddressService } from '../../services/address.service';
import { Address } from '../../models/address';
import { AddressFormComponent } from '../address-form/address-form';

@Component({
    selector: 'app-address-list',
    standalone: true,
    imports: [CommonModule, RouterLink, AddressFormComponent],
    templateUrl: './address-list.component.html',
    styleUrls: ['./address-list.component.css']
})
export class AddressListComponent implements OnInit {
    addresses: Address[] = [];
    isLoading = true;
    showAddressForm = false;
    editingAddress: Address | null = null;

    constructor(
        private addressService: AddressService
    ) {}

    ngOnInit() {
        this.loadAddresses();
    }

    loadAddresses() {
        this.isLoading = true;
        this.addressService.getAddresses().subscribe({
            next: (response: any) => {
                this.addresses = response.addresses || [];
                this.isLoading = false;
            },
            error: () => {
                console.error('Failed to load addresses');
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

    onDeleteAddress(id: number) {
        if (confirm('Are you sure you want to delete this address?')) {
            this.addressService.deleteAddress(id).subscribe({
                next: () => {
                    console.log('Address deleted successfully');
                    this.loadAddresses();
                },
                error: () => {
                    console.error('Failed to delete address');
                }
            });
        }
    }

    onSetDefault(id: number) {
        this.addressService.setDefaultAddress(id).subscribe({
            next: () => {
                console.log('Default address updated');
                this.loadAddresses();
            },
            error: () => {
                console.error('Failed to set default address');
            }
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
        switch(type) {
            case 'home': return '🏠';
            case 'work': return '💼';
            default: return '📍';
        }
    }
}