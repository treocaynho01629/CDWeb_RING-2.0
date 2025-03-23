import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: null,
    shop: null,
    persist: false,
  },
  reducers: {
    setAuth: (state, action) => {
      const token = action.payload;
      state.token = token;
    },
    setPersist: (state, action) => {
      const persist = action.payload;
      state.persist = persist;
    },
    setShop: (state, action) => {
      const shop = action.payload;
      state.shop = shop;
    },
    clearAuth: (state, action) => {
      state.token = null;
      state.shop = null;
      state.persist = false;
    },
  },
});

export const { setAuth, setShop, setPersist, clearAuth } = authSlice.actions;
export const selectCurrentToken = (state) => state.auth.token;
export const selectShop = (state) => state.auth.shop;
export const isPersist = (state) => state.auth.persist;

export default authSlice.reducer;
