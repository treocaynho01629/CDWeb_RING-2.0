import { apiSlice, store, authReducer, enumReducer } from "@ring/redux";
import { combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import appReducer from "../features/app/appReducer";
import cartReducer from "../features/cart/cartReducer";
import addressReducer from "../features/addresses/addressReducer";
import couponReducer from "../features/coupons/couponReducer";
import storage from "redux-persist/lib/storage";

const appPersistConfig = {
  key: "app",
  version: 1,
  storage,
};

const enumPersistConfig = {
  key: "enum",
  version: 1,
  storage,
};

const authPersistConfig = {
  key: "auth",
  version: 1,
  storage,
};

const cartPersistConfig = {
  key: "cart",
  version: 1,
  storage,
};

const addressPersistConfig = {
  key: "address",
  version: 1,
  storage,
};

const couponPersistConfig = {
  key: "coupon",
  version: 1,
  storage,
};

// Static reducer
const staticReducer = {
  [apiSlice.reducerPath]: apiSlice.reducer,
};

// Web reducers
const webReducers = {
  app: persistReducer(appPersistConfig, appReducer), //APP
  enum: persistReducer(enumPersistConfig, enumReducer), //ENUM
  auth: persistReducer(authPersistConfig, authReducer), //AUTH
  cart: persistReducer(cartPersistConfig, cartReducer), //CART
  address: persistReducer(addressPersistConfig, addressReducer), //ADDRESS
  coupon: persistReducer(couponPersistConfig, couponReducer), //COUPON
};

// Replace/inject reducers
store.replaceReducer(combineReducers({ ...staticReducer, ...webReducers }));

export let persistor = persistStore(store);
