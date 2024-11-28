import { CartItem } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


const saveCartToLocalStorage = (cart: CartItem[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("cartItems", JSON.stringify(cart));
  }
};


const loadCartFromLocalStorage = (): CartItem[] => {
  if (typeof window !== "undefined") {
    const storedCart = localStorage.getItem("cartItems");
    if (storedCart) {
      return JSON.parse(storedCart);
    }
  }
  return [];
};


const initialState: CartState = {
  cartItems: loadCartFromLocalStorage(),
};

export interface CartState {
  cartItems: CartItem[];
}

export const cartSlice = createSlice({
  name: "cart",
  initialState,

  reducers: {
    addToCart(state, action: PayloadAction<CartItem>) {
      state.cartItems.push(action.payload);
      saveCartToLocalStorage(state.cartItems); 
    },
    updateToCart(state, action: PayloadAction<CartItem[]>) {
      state.cartItems = action.payload;
      saveCartToLocalStorage(state.cartItems); 
    },
    emptyToCart(state) {
      state.cartItems = [];
      saveCartToLocalStorage(state.cartItems); 
    },
    removeProductById: (state, action: PayloadAction<string | number>) => {
      state.cartItems = state.cartItems.filter(
        (product) => product.id !== action.payload
      );
      saveCartToLocalStorage(state.cartItems); 
    },
    resetState: (state) => {
      state.cartItems = [];
      saveCartToLocalStorage(state.cartItems); 
    },
  },
});

export const { addToCart, updateToCart, emptyToCart, removeProductById, resetState } = cartSlice.actions;

export default cartSlice.reducer;
