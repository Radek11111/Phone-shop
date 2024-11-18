import { CartItem } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CartState {
  cartItems: CartItem[];
}

const initialState: CartState = {
  cartItems: [],
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,

  reducers: {
    addToCart(state, action) {
      state.cartItems.push(action.payload);
    },
    updateToCart(state, action) {
      state.cartItems = action.payload;
    },
    emptyToCart(state, action) {
      state.cartItems = [];
    },
    removeProductById: (state, action: PayloadAction<string>) => {
      state.cartItems = state.cartItems.filter(
        (product) => product.id !== action.payload
      );
    },
    resetState: () => initialState,
  },
});

export const { addToCart, updateToCart, emptyToCart } = cartSlice.actions;

export default cartSlice.reducer;
