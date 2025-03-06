import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CartItemRedux {
  id: string;
  name: string;
  price: number;
  qty: number;
  thumbnail: string;
}

interface CartState {
  cartItems: CartItemRedux[];
}

const saveCartToLocalStorage = (cart: CartItemRedux[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("cartItems", JSON.stringify(cart));
  }
};

const loadCartFromLocalStorage = (): CartItemRedux[] => {
  try {
    if (typeof window === "undefined") return [];
    const cartData = localStorage.getItem("cartItems");
    return cartData ? JSON.parse(cartData) : [];
  } catch (error) {
    console.error("Error loading cart from localStorage:", error);
    return [];
  }
};

const initialState: CartState = {
  cartItems: loadCartFromLocalStorage(),
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<CartItemRedux>) {
      const newItem = action.payload;
      const existingItem = state.cartItems.find(
        (item) => item.id === newItem.id
      );

      if (existingItem) {
        existingItem.qty += newItem.qty;
      } else {
        state.cartItems.push(newItem);
      }
      saveCartToLocalStorage(state.cartItems);
    },
    updateCart(state, action: PayloadAction<{ id: string; qty: number }>) {
      const item = state.cartItems.find(
        (item) => item.id === action.payload.id
      );
      if (item) {
        item.qty = action.payload.qty;
      }
      saveCartToLocalStorage(state.cartItems);
    },

    removeProductById(state, action: PayloadAction<string>) {
      state.cartItems = state.cartItems.filter(
        (product) => product.id !== action.payload
      );
      saveCartToLocalStorage(state.cartItems);
    },
    clearCart(state) {
      state.cartItems = [];
      saveCartToLocalStorage(state.cartItems);
    },
  },
});

export const { addToCart, updateCart, removeProductById, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
