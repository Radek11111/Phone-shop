export interface CartItem {
  id: string;
  name: string;
  title: string;
  qty: number;
  price: number;
  thumbnail: string;
  description: string;
}

export interface ShippingData {
  name: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  state?: string | null;
  phoneNumber?: string | null;
}

export interface OrderData {
  id: string;
  items: CartItem[];
  total: number;
  shipping: ShippingData | null;
  status:
    | "awaiting_payment"
    | "awaiting_shipment"
    | "shipped"
    | "delivered"
    | "cancelled";
  createdAt: string;
  isPaid: boolean;
}

export interface CartState {
  cartItems: CartItem[];
}
