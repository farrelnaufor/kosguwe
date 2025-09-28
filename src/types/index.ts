export interface Room {
  id: string;
  name: string;
  description: string;
  price: number;
  facilities: string[];
  image_url: string;
  is_available: boolean;
  size: string;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  role: 'tenant' | 'owner';
  avatar_url?: string;
  created_at: string;
}

export interface Booking {
  id: string;
  room_id: string;
  user_id: string;
  check_in: string;
  check_out: string;
  total_price: number;
  status: 'pending' | 'paid' | 'confirmed' | 'cancelled';
  payment_id?: string;
  created_at: string;
  room?: Room;
  user?: User;
}

export interface Payment {
  id: string;
  booking_id: string;
  amount: number;
  status: 'pending' | 'paid' | 'failed';
  payment_method: string;
  qr_code_url?: string;
  transaction_id?: string;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  booking_id?: string;
  created_at: string;
  sender?: User;
}