import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface OrderRedux {
  id?: string;
  items: { id: string; title: string; price: number; qty: number }[];
  shippingAddress: string;
  paymentMethod: string;
  shippingMethod: string;
  total: number;
  orderState?: string;
}

interface OrderState {
  order: OrderRedux | null;
}

const initialState: OrderState = {
  order: null,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    createOrder: (state, action: PayloadAction<OrderRedux>) => {
      state.order = action.payload;
    },
    updateOrder: (state, action: PayloadAction<Partial<OrderRedux>>) => {
      if (state.order) {
        state.order = { ...state.order, ...action.payload };
      }
    },
    resetOrder: (state) => {
      state.order = null; 
      console.log("resetOrder invoked, state:", state.order); 
    },
  },
});

export const { createOrder, updateOrder, resetOrder } = orderSlice.actions;
export default orderSlice.reducer;
