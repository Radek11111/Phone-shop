

export type CartItem = {
  product: string;
  name: string;
  desription: string;
  optionBefore: number;
  option: string;
  slug: string;
  sku: string;
  shipping: string;
  images: string[];
  price: number;
  priceBefore: number;
  qty: number;
  stock: number;
  brand: string;
  likes: string[];
  _uid: string;
};

export type Cart = {
  cartItems: CartItem[];
  cartTotal: number;
  products: Product[];
};

export type Product = {
  _id: string;
  name: string;
  featured: boolean;
  slug: string;
  description: string;

};


export type Listing = {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
};

