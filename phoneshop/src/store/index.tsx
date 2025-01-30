import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import cartReducer from "./cartSlice";
import favouritesReducer from "./favouritesSlice";
import orderReducer from "@/store/orderSlice"

const rootReducer = combineReducers({
  cart: cartReducer,
  favourites: favouritesReducer,
  order: orderReducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;
export type IRootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;