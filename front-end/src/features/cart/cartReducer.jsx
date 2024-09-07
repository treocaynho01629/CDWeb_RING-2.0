import { createSlice } from "@reduxjs/toolkit";

const initialState = { products: [], addresses: [] };

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
    decreaseQuantity: (state, action) => {
      const item = state.products.find((item) => item.id === action.payload);
      if (item) {
        if (item.quantity == 1) {  //Remove if < 0
          state.products = state.products.filter(item => item.id !== action.payload)
        } else {
          item.quantity--;
        }
      }
    },
    //Increase quantity
    increaseQuantity: (state, action) => {
      const item = state.products.find((item) => item.id === action.payload);
      const newQuantity = item.quantity + 1;
      if (item) { newQuantity > (item.amount ?? 199) ? item.quantity = (item.amount ?? 199) : item.quantity++};
    },
    //Input quantity
    changeQuantity: (state, action) => {
      const item = state.products.find((item) => item.id === action.payload.id);
      const quantity = action.payload.quantity;
      if (item) {
        if (isNaN(quantity)) { //Reset to 1 if not valid input
          item.quantity = 1;
        } else if (quantity < 1) { //Remove if < 1
          state.products = state.products.filter(item => item.id !== action.payload.id)
        } else if (quantity > (item.amount ?? 199)) { //Cap quantity to max stock amount
          item.quantity = (item.amount ?? 199);
        } else {
          item.quantity = quantity;
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
    //Add address
    addAddress: (state, action) => {
      const item = state.addresses.find((item) => item.id === action.payload.id);
      if (item) { //Update old address
        item.fullName = action.payload.fullName;
        item.phone = action.payload.phone;
        item.city = action.payload.city;
        item.ward = action.payload.ward;
        item.address = action.payload.address;
      } else { //Add if not exists
        let address = action.payload;
        //Id increament
        const id = state.addresses.length ? state.addresses[state.addresses.length - 1].id + 1 : 0;
        address.id = id;
        state.addresses.push(address);
      }
    },
    removeStateAddress: (state, action) => {
      state.addresses = state.addresses.filter(item => item.id !== action.payload)
    },
  },
});

export const { addToCart, increaseQuantity, decreaseQuantity, changeQuantity, removeItem, resetCart, addAddress, removeStateAddress } = cartSlice.actions;
export const selectCartProducts = (state) => state.cart.products;
export const selectAddresses = (state) => state.cart.addresses;

export default cartSlice.reducer;