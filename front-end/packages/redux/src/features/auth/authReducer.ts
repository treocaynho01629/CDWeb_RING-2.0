import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../lib/store";

export interface AuthState {
  token: string | null;
  shop: string | null;
  persist: boolean;
}

const initialState: AuthState = {
  token: null,
  shop: null,
  persist: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<string>) => {
      const token = action.payload;
      state.token = token;
    },
    setPersist: (state, action: PayloadAction<boolean>) => {
      const persist = action.payload;
      state.persist = persist;
    },
    setShop: (state, action: PayloadAction<string>) => {
      const shop = action.payload;
      state.shop = shop;
    },
    clearAuth: (state) => {
      state.token = null;
      state.shop = null;
      state.persist = false;
    },
  },
});

export const { setAuth, setShop, setPersist, clearAuth } = authSlice.actions;

export const selectCurrentToken = (state: RootState): string | null =>
  state.auth.token;
export const selectShop = (state: RootState): string | null => state.auth.shop;
export const isPersist = (state: RootState): boolean => state.auth.persist;

export default authSlice.reducer;
