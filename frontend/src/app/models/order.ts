export interface OrderItem {
  id?: number;
  product_name: string;
  quantity: number;
  price: number;
  total_price: number;
}

export interface Order {
  id?: number;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_address: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
  payment_method: 'cash' | 'card' | 'online';
  payment_status: 'pending' | 'completed' | 'failed';
  items: OrderItem[];
  subtotal: number;
  delivery_fee: number;
  total_amount: number;
  special_instructions?: string;
  created_at?: Date;
  updated_at?: Date;
  estimated_delivery_time?: Date;
}

export interface OrderCreate {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_address: string;
  payment_method: string;
  items: OrderItem[];
  special_instructions?: string;
}

export interface OrderUpdate {
  status?: string;
  payment_status?: string;
  special_instructions?: string;
}