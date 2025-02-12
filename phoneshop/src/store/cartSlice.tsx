import { CartItem } from "@prisma/client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CartState {
  cartItems: CartItem[];
}

const saveCartToLocalStorage = (cart: CartItem[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("cartItems", JSON.stringify(cart));
  }
};

function loadCartFromLocalStorage(): CartItem[] {
  try {
    if (typeof window === "undefined") return [];

    const cartData = localStorage.getItem("cartItems");
    return cartData ? JSON.parse(cartData) : [];
  } catch (error) {
    console.error("Error loading cart from localStorage:", error);
    return [];
  }
}

const initialState: CartState = {
  cartItems: loadCartFromLocalStorage(),
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<CartItem>) {
      const newItem = action.payload;
     
      const existingItem = state.cartItems.find(item => item.id === newItem.id);

      if (existingItem) {
        
        existingItem.qty += newItem.qty;
      } else {
       
        state.cartItems.push(newItem);
      }
      saveCartToLocalStorage(state.cartItems);
    },
    updateToCart(state, action: PayloadAction<CartItem[]>) {
      state.cartItems = action.payload;
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
    resetState(state) {
      state.cartItems = [];
      saveCartToLocalStorage(state.cartItems);
    },
    clearCart(state) {
      state.cartItems = [];
      saveCartToLocalStorage(state.cartItems);
    },
  },
});

export const {
  addToCart,
  updateToCart,
  emptyToCart,
  removeProductById,
  resetState,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
