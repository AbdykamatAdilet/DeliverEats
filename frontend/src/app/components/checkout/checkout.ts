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
  paymentMethod: string = 'cash';
  specialInstructions: string = '';
  isLoading = false;
  cartItems: any[] = [];
  cartTotal = 0;
  deliveryFee = 500;

  paymentMethods = [
    { value: 'card', label: 'Credit/Debit Card', icon: '💳' },
    { value: 'cash', label: 'Cash on Delivery', icon: '💰' },
    { value: 'kaspi', label: 'Kaspi.kz', icon: '🏦' },
    { value: 'apple_pay', label: 'Apple Pay', icon: '📱' }
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
    this.addressService.getAddresses().subscribe({
      next: (response) => {
        this.addresses = response.addresses;
        if (response.default_address) {
          this.selectedAddressId = response.default_address.id!;
        } else if (this.addresses.length > 0) {
          this.selectedAddressId = this.addresses[0].id!;
        }
      },
      error: () => {
        this.errorHandler.showError('Failed to load addresses');
      }
    });
  }

  loadCart() {
    this.cartService.getCartItems().subscribe({
      next: (items: any[]) => {
        this.cartItems = items;
        this.calculateTotal();
      },
      error: () => {
        this.cartTotal = 0;
      }
    });
  }

  calculateTotal() {
    this.cartTotal = this.cartItems.reduce((sum, item) => {
      const price = item.menu_item?.price || 0;
      const quantity = item.quantity || 0;
      return sum + (price * quantity);
    }, 0);
  }

  getAddressIcon(type: string): string {
    switch(type) {
      case 'home': return '🏠';
      case 'work': return '💼';
      default: return '📍';
    }
  }

  getAddressSummary(address: Address): string {
    let summary = address.street;
    if (address.building) summary += `, ${address.building}`;
    if (address.apartment) summary += `, apt ${address.apartment}`;
    return summary;
  }

  getTotalWithDelivery(): number {
    return this.cartTotal + this.deliveryFee;
  }

  placeOrder() {
    if (!this.selectedAddressId) {
      this.errorHandler.showError('Please select a delivery address');
      return;
    }

    if (this.cartItems.length === 0) {
      this.errorHandler.showError('Your cart is empty');
      return;
    }

    this.isLoading = true;

    const checkoutData: CheckoutRequest = {
      address_id: this.selectedAddressId,
      payment_method: this.paymentMethod as any,
      special_instructions: this.specialInstructions || undefined,
      use_bonuses: false
    };

    this.checkoutService.processCheckout(checkoutData).subscribe({
      next: (response) => {
        this.errorHandler.showSuccess(
          `Order #${response.order_id} placed successfully! Total: ${response.total_amount} ₸`
        );
        this.cartService.clearCart().subscribe({
          next: () => {
            setTimeout(() => {
              this.router.navigate(['/profile']);
            }, 2000);
          },
          error: () => {
            setTimeout(() => {
              this.router.navigate(['/profile']);
            }, 2000);
          }
        });
      },
      error: (err) => {
        const errorMsg = err.error?.error || err.error?.message || 'Failed to place order';
        this.errorHandler.showError(errorMsg);
        this.isLoading = false;
      }
    });
  }
}