import { createSlice } from "@reduxjs/toolkit";

const initialState = { products: [] };

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {

    //Add product to cart
    addToCart: (state, action) => {
      const item = state.products.find((item) => item.id === action.payload.id);
      if (item) { //If already in cart >> increase quantity
        item.quantity += action.payload.quantity;
      } else { //Put to cart if not already
        state.products.push(action.payload);
      }
    },
    //Decrease quantity
    decreaseQuantity: (state, action)=> {
      const item = state.products.find((item) => item.id === action.payload);
      if (item) {
        if (item.quantity == 1){  //Remove if < 0
          state.products = state.products.filter(item => item.id !== action.payload)
        } else {
          item.quantity --;
        }
      }
    },
    //Increase quantity
    increaseQuantity: (state, action)=> {
      const item = state.products.find((item) => item.id === action.payload);
      if (item) { item.quantity ++ }
    },
    //Input quantity
    changeQuantity: (state, action)=> {
      const item = state.products.find((item) => item.id === action.payload.id);
      if (item) {
        if (isNaN(action.payload.quantity)){ //Reset to 1 if not valid input
          item.quantity = 1;
        } else if (action.payload.quantity < 1){ //Remove if < 1
          state.products = state.products.filter(item => item.id !== action.payload.id)
        } else {
          item.quantity = action.payload.quantity;
        }
      }
    },
    //Remove product from cart
    removeItem: (state, action) => {
      state.products = state.products.filter(item => item.id !== action.payload)
    },
    //Clear cart
    resetCart: (state) => {
      state.products = []
    },
  },
});

export const { addToCart, increaseQuantity, decreaseQuantity, changeQuantity, removeItem, resetCart } = cartSlice.actions;
export const selectCartProducts = (state) => state.cart.products;

export default cartSlice.reducer;