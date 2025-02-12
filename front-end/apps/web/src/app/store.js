import { configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import { apiSlice, authReducer } from "@ring/redux";
import cartReducer from "../features/cart/cartReducer";
import addressReducer from "../features/addresses/addressReducer";
import storage from "redux-persist/lib/storage";

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

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: persistReducer(authPersistConfig, authReducer), //AUTH
    cart: persistReducer(cartPersistConfig, cartReducer), //CART
    address: persistReducer(addressPersistConfig, addressReducer), //ADDRESS
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(apiSlice.middleware),
  devTools: import.meta.env.VITE_NODE_ENV === "dev",
});

export let persistor = persistStore(store);
