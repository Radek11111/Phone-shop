import { OrderDetails } from "@prisma/client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface OrderStateRedux {
  orders: OrderDetails[];
}

const initialState: OrderStateRedux = {
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
