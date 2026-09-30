export interface Product {
  id: string;
  file: string;
  name: string;
  cat: string;
  tags?: string;
  price: number;
  priceStr: string;
  size: string;
  categoryAttr: string;
  collection?: string;
  ribbon?: string;
  desc?: string;
  is_exclusive?: number;
  vip_min_level?: string;
}

// Matches the real Turso DB schema
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'customer' | 'admin';
  avatar?: string;
  vip_level?: string;
  loyalty_points?: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  user_id: string;
  total: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  items: CartItem[];
  address?: string;
  created_at: string;
}

export type FullUser = User & {
  orders: Order[];
  loyalty_points: number;
  vip_level: string;
};
