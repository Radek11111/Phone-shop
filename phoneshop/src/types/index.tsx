export type Product = {
  id: string;
  title: string;
  price: number;
  quantity: number;
  total: number;
  discountPercentage: number;
  discountedTotal: number;
  thumbnail: string;
};

export type CartItem = {
  id: string;
  name: string;
  price: number;
  amount: number;
};

export type Cart = {
  cartItems: CartItem[];
  cartTotal: number;
  products: Product[];
};

export type Listing = {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
};
