import { combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import { store, apiSlice, authReducer, enumReducer } from "@ring/redux";
import storage from "redux-persist/lib/storage";

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

// Static reducer
const staticReducer = {
  [apiSlice.reducerPath]: apiSlice.reducer,
};

// Web reducers
const webReducers = {
  enum: persistReducer(enumPersistConfig, enumReducer), //ENUM
  auth: persistReducer(authPersistConfig, authReducer), //AUTH
};

// Replace/inject reducers
store.replaceReducer(combineReducers({ ...staticReducer, ...webReducers }));

export let persistor = persistStore(store);
