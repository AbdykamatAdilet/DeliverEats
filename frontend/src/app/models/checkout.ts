export interface CheckoutRequest {
  address_id: number;
  payment_method: 'card' | 'cash' | 'kaspi' | 'apple_pay';
  special_instructions?: string;
  use_bonuses?: boolean;
}

export interface CheckoutResponse {
  message: string;
  order_id: number;
  total_amount: string;
}