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
import { apiSlice } from './api/apiSlice'
import storage from "redux-persist/lib/storage";
import cartReducer from "../features/cart/cartReducer";
import authReducer from '../features/auth/authReducer'

const persistConfig = {
    key: "rootbook",
    version: 1,
    storage,
};

const persistedReducer = persistReducer(persistConfig, cartReducer);

export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        auth: authReducer, //AUTH
        cart: persistedReducer, //CART
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }).concat(apiSlice.middleware),
    // devTools: false
});

export let persistor = persistStore(store);