type Dimensions = {
  width: number;
  height: number;
  depth: number;
};

type Review = {
  rating: number;
  comment: string;
  date: string; 
  reviewerName: string;
  reviewerEmail: string;
};

type Meta = {
  createdAt: string;
  updatedAt: string;
  barcode: string;
  qrCode: string;
};

export type Product = {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand: string;
  sku: string;
  weight: number;
  dimensions: Dimensions;
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  reviews: Review[];
  returnPolicy: string;
  minimumOrderQuantity: number;
  meta: Meta;
  images: string[];
  thumbnail: string;
  slug: string;
};

export type CartItem = {
  id: string | number;
  name: string;
  price: number;
  amount: number;
  thumbnail: string;
  qty: number
  title: string;
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
