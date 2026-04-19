export interface CheckoutRequest {
  address_id: number;
  payment_method: 'card' | 'cash' | 'kaspi' | 'apple_pay';
  special_instructions?: string;
  use_bonuses?: boolean;
}

export interface CheckoutResponse {
  message: string;
  order_id: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'delivering' | 'delivered' | 'cancelled';
  total_amount: string;
  estimated_delivery: string;
  payment_status?: 'paid' | 'pending' | 'failed';
  bonuses_used?: number;
  bonuses_earned?: number;
}