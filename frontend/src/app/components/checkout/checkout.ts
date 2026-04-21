  import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Address } from '../../models/address';
import { CheckoutRequest } from '../../models/checkout';
import { AddressService } from '../../services/address.service';
import { CheckoutService } from '../../services/checkout.service';
import { ErrorHandlerService } from '../../services/error-handler.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './checkout.html',
  styleUrls: ['./checkout.css']
})
export class CheckoutComponent implements OnInit {
  addresses: Address[] = [];
  selectedAddressId: number | null = null;
  paymentMethod = 'cash';
  specialInstructions = '';
  isLoading = false;
  isLoadingCart = true;
  isLoadingAddresses = true;
  cartItems: any[] = [];
  cartTotal = 0;
  deliveryFee = 500;

  paymentMethods = [
    { value: 'card',      label: 'Credit/Debit Card', icon: '💳' },
    { value: 'cash',      label: 'Cash on Delivery',  icon: '💰' },
    { value: 'kaspi',     label: 'Kaspi.kz',          icon: '🏦' },
    { value: 'apple_pay', label: 'Apple Pay',          icon: '📱' },
  ];

  constructor(
    private addressService: AddressService,
    private checkoutService: CheckoutService,
    private cartService: CartService,
    private errorHandler: ErrorHandlerService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadAddresses();
    this.loadCart();
  }

  loadAddresses() {
    this.isLoadingAddresses = true;
    this.addressService.getAddresses().subscribe({
      next: (response) => {
        this.addresses = response.addresses;
        if (response.default_address) {
          this.selectedAddressId = response.default_address.id!;
        } else if (this.addresses.length > 0) {
          this.selectedAddressId = this.addresses[0].id!;
        }
        this.isLoadingAddresses = false;
      },
      error: () => {
        this.errorHandler.showError('Failed to load addresses');
        this.isLoadingAddresses = false;
      }
    });
  }

  loadCart() {
    this.isLoadingCart = true;
    this.cartService.getCartItems().subscribe({
      next: (data: any) => {
        this.cartItems = data?.items ?? (Array.isArray(data) ? data : []);
        this.calculateTotal();
        this.isLoadingCart = false;
      },
      error: () => {
        this.cartTotal = 0;
        this.cartItems = [];
        this.isLoadingCart = false;
      }
    });
  }

  calculateTotal() {
    this.cartTotal = this.cartItems.reduce((sum, item) => {
      return sum + (parseFloat(item.menu_item?.price) || 0) * (item.quantity || 0);
    }, 0);
  }

  getAddressIcon(type: string): string {
    return type === 'home' ? '🏠' : type === 'work' ? '💼' : '📍';
  }

  getAddressSummary(address: Address): string {
    let s = address.street;
    if (address.building) s += `, ${address.building}`;
    if (address.apartment) s += `, apt ${address.apartment}`;
    return s;
  }

  getTotalWithDelivery() { return this.cartTotal + this.deliveryFee; }

  placeOrder() {
    if (!this.selectedAddressId) { this.errorHandler.showError('Please select a delivery address'); return; }
    if (this.cartItems.length === 0) { this.errorHandler.showError('Your cart is empty'); return; }

    this.isLoading = true;

    const data: CheckoutRequest = {
      address_id: this.selectedAddressId,
      payment_method: this.paymentMethod as any,
      special_instructions: this.specialInstructions || undefined,
      use_bonuses: false
    };

    this.checkoutService.processCheckout(data).subscribe({
      next: (response) => {
        this.errorHandler.showSuccess(`Order #${response.order_id} placed! Total: ${response.total_amount} ₸`);
        this.isLoading = false;
        setTimeout(() => this.router.navigate(['/orders']), 2000);
      },
      error: (err) => {
        const msg = err.error?.error || err.error?.message || 'Failed to place order';
        this.errorHandler.showError(msg);
        this.isLoading = false;
      }
    });
  }
}