import { CartItem } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CartState {
  cartItems: CartItem[];
}

const saveCartToLocalStorage = (cart: CartItem[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
};

const loadCartFromLocalStorage = (): CartItem[] => {
  try {
    if (typeof window === "undefined") return [];
    const cartData = localStorage.getItem("cart");
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
    addToCart(state, action: PayloadAction<CartItem>) {
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
      if (typeof window !== "undefined") {
        localStorage.setItem("cart", JSON.stringify([]));
        console.log(
          "Cart cleared, localStorage:",
          localStorage.getItem("cart")
        );
      }
    },
  },
});

export const { addToCart, updateCart, removeProductById, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
