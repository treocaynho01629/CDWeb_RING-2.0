import { createSlice } from "@reduxjs/toolkit";

const initialState = { coupons: [] };

export const couponSlice = createSlice({
  name: "coupon",
  initialState,
  reducers: {
    //Add coupon
    addCoupon: (state, action) => {
      state.coupons.push(action.payload);
    },
    removeCoupon: (state, action) => {
      state.coupons = state.coupons.filter((code) => code !== action.payload);
    },
  },
});

export const { addCoupon, removeCoupon } = couponSlice.actions;
export const selectCoupons = (state) => state.coupon.coupons;

export default couponSlice.reducer;
