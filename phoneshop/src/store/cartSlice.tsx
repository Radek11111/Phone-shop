import { CartItem } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


const saveCartToLocalStorage = (cart: CartItem[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("cartItems", JSON.stringify(cart));
  }
};


function loadCartFromLocalStorage() {
  try {
    const cartData = localStorage.getItem("cart");
    const parsedCart = cartData ? JSON.parse(cartData) : {};

    return Array.isArray(parsedCart.cartItems) ? parsedCart.cartItems : [];
  } catch (error) {
    console.error("Error loading cart from localStorage:", error);
    return [];
  }
}

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
      const newItem = {
        ...action.payload,
        title: action.payload.title,
      };
      state.cartItems.push(newItem);
      saveCartToLocalStorage(state.cartItems);
    },
    updateToCart(state, action: PayloadAction<CartItem[]>) {
      state.cartItems = action.payload.map((item) => ({
        ...item,
        title: item.title,
      }));
      saveCartToLocalStorage(state.cartItems);
    },
    removeProductById(state, action: PayloadAction<string | number>) {
      state.cartItems = state.cartItems.filter(
        (product) => product.id !== action.payload
      );
      saveCartToLocalStorage(state.cartItems);
    },
    emptyToCart(state) {
      state.cartItems = [];
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
