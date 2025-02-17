import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface OrderStateRedux {
  order: {
    shippingAddress: string;
    paymentMethod: string;
    shippingMethod: string;
    total: number;
    items: {
      id: string;
      name: string;
      price: number;
      qty: number;
      thumbnail: string;
    }[];
  };
}

const initialState: OrderStateRedux = {
  order: {
    shippingAddress: "",
    paymentMethod: "",
    shippingMethod: "",
    total: 0,
    items: [],
  },
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setShippingAddress: (state, action: PayloadAction<string>) => {
      state.order.shippingAddress = action.payload;
    },
    setPaymentMethod: (state, action: PayloadAction<string>) => {
      state.order.paymentMethod = action.payload;
    },
    setShippingMethod: (state, action: PayloadAction<string>) => {
      state.order.shippingMethod = action.payload;
    },
    addCartItem: (state, action: PayloadAction<OrderStateRedux["order"]["items"][0]>) => {
      state.order.items.push(action.payload);
    },
    resetOrder: () => initialState,
  },
});

export const { setShippingAddress, setPaymentMethod, setShippingMethod, addCartItem, resetOrder } = orderSlice.actions;
export default orderSlice.reducer;
