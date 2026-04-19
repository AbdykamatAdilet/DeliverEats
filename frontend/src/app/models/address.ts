export interface Address {
  id?: number;
  address_type: 'home' | 'work' | 'other';
  street: string;
  building: string | null;
  apartment: string | null;
  entrance: string | null;
  floor: string | null;
  phone_number: string;
  special_instructions: string;
  is_default: boolean;
  created_at?: string;
}