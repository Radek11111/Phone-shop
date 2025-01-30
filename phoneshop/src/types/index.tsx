type Dimensions = {
  width: number;
  height: number;
  depth: number;
};

export type Product = {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  rating: number;
  brand: string;
  weight: number;
  dimensions: Dimensions;
  returnPolicy: string;
  minimumOrderQuantity: number;
  thumbnail: string;
  slug: string;
};

export type CartItem = {
  id: string | number;
  name: string;
  price: number;
  amount: number;
  thumbnail: string;
  qty: number;
  title: string;
};

export type Cart = {
  cartItems: CartItem[];
  cartTotal: number;
  products: Product[];
};

export interface CartState {
  cartItems: CartItem[];
  items: [];
};

export interface OrderDetails {
  items: CartItem[];
  shippingAddress: string;
  paymentMethod: string;
  shippingMethod: string;
  total: number;
};

export interface OrderState {
  orders: OrderDetails[];
}

