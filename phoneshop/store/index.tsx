import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import cartReducer from "./cartSlice";

const rootReducer = combineReducers({ cart: cartReducer });

const store = configureStore({
  reducer: rootReducer,
});

export default store;
export type IRootState = ReturnType<typeof store.getState>;
