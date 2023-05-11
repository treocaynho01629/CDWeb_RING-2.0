import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [],
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = state.products.find((item) => item.id === action.payload.id);
      if (item) {
        item.quantity += action.payload.quantity;
      } else {
        state.products.push(action.payload);
      }
    },
    decreaseQuantity: (state, action)=> {
      const item = state.products.find((item) => item.id === action.payload);
      if (item) {
        if (item.quantity == 1){
          state.products = state.products.filter(item => item.id !== action.payload)
        } else {
          item.quantity --;
        }
      }
    },
    increaseQuantity: (state, action)=> {
      const item = state.products.find((item) => item.id === action.payload);
      if (item) {
        item.quantity ++;
      }
    },
    changeQuantity: (state, action)=> {
      const item = state.products.find((item) => item.id === action.payload.id);
      if (item) {
        if (isNaN(action.payload.quantity)){
          item.quantity = 1;
        } else if (action.payload.quantity < 1){
          state.products = state.products.filter(item => item.id !== action.payload.id)
        } else {
          item.quantity = action.payload.quantity;
        }
      }
    },
    removeItem: (state, action) => {
      state.products = state.products.filter(item => item.id !== action.payload)
    },
    resetCart: (state) => {
      state.products = []
    },
  },
});

// Action creators are generated for each case reducer function
export const { addToCart, increaseQuantity, decreaseQuantity, changeQuantity, removeItem, resetCart } = cartSlice.actions;

export default cartSlice.reducer;