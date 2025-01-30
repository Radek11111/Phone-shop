import { OrderDetails, OrderState } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: OrderState = {
  orders: [],
};

const OrderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    createOrder: (state, action: PayloadAction<OrderDetails>) => {
      state.orders.push(action.payload);
    },
  },
});

export const { createOrder } = OrderSlice.actions;
export default OrderSlice.reducer;
