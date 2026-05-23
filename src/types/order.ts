/**
 * TypeScript types for the orders table
 * Keeping types in one place ensures consistency across the app
 */

export interface OrderItem {
    id: string;
    name: string;
    price: number; // in pence
    quantity: number;
  }
  
  export interface DeliveryAddress {
    line1: string;
    line2?: string;
    city: string;
    postcode: string;
  }
  
  export type OrderStatus =
    | 'pending'
    | 'confirmed'
    | 'preparing'
    | 'out_for_delivery'
    | 'delivered'
    | 'cancelled';
  
  export interface Order {
    id: string;
    stripe_session_id: string;
    customer_name: string;
    customer_email: string;
    customer_phone?: string;
    delivery_address: DeliveryAddress;
    items: OrderItem[];
    subtotal: number; // pence
    delivery_fee: number; // pence
    total: number; // pence
    status: OrderStatus;
    notes?: string;
    created_at: string;
    updated_at: string;
  }