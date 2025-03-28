import { createSlice } from "@reduxjs/toolkit";

const initialState = { products: [] };

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    //Add product to cart
    addToCart: (state, action) => {
      const item = state.products.find((item) => item.id === action.payload.id);
      if (item) {
        //If already in cart >> increase quantity
        const newQuantity = item.quantity + action.payload.quantity;
        newQuantity > (item.amount ?? 199)
          ? (item.quantity = item.amount ?? 199)
          : (item.quantity += action.payload.quantity);
      } else {
        //Put to cart if not already
        state.products.push(action.payload);
      }
    },
    //Replace product in cart
    replaceInCart: (state, action) => {
      const item = state.products.find((item) => item.id === action.payload.id);
      if (item) {
        //If already in cart >> replace
        item.slug = action.payload.slug;
        item.title = action.payload.title;
        item.amount = action.payload.amount;
        item.price = action.payload.price;
        item.discount = action.payload.discount;
        item.shopId = action.payload.shopId;
        item.shopName = action.payload.shopName;
      } else {
        //Put to cart if not already
        state.products.push(action.payload);
      }
    },
    //Decrease quantity
    decreaseQuantity: (state, action) => {
      const item = state.products.find((item) => item.id === action.payload);
      if (item) {
        if (item.quantity == 1) {
          //Remove if < 0
          state.products = state.products.filter(
            (item) => item.id !== action.payload,
          );
        } else {
          item.quantity--;
        }
      }
    },
    //Increase quantity
    increaseQuantity: (state, action) => {
      const item = state.products.find((item) => item.id === action.payload);
      const newQuantity = item.quantity + 1;
      if (item) {
        newQuantity > (item.amount ?? 199)
          ? (item.quantity = item.amount ?? 199)
          : item.quantity++;
      }
    },
    //Input quantity
    changeQuantity: (state, action) => {
      const item = state.products.find((item) => item.id === action.payload.id);
      const quantity = action.payload.quantity;
      if (item) {
        if (isNaN(quantity)) {
          //Reset to 1 if not valid input
          item.quantity = 1;
        } else if (quantity < 1) {
          //Remove if < 1
          state.products = state.products.filter(
            (item) => item.id !== action.payload.id,
          );
        } else if (quantity > (item.amount ?? 199)) {
          //Cap quantity to max stock amount
          item.quantity = item.amount ?? 199;
        } else {
          item.quantity = quantity;
        }
      }
    },
    //Remove product from cart
    removeItem: (state, action) => {
      state.products = state.products.filter(
        (item) => item.id !== action.payload,
      );
    },
    //Remove shop product
    removeShopItem: (state, action) => {
      state.products = state.products.filter(
        (item) => item.shopId !== action.payload,
      );
    },
    //Clear cart
    resetCart: (state) => {
      state.products = [];
    },
  },
});

export const {
  addToCart,
  replaceInCart,
  increaseQuantity,
  decreaseQuantity,
  changeQuantity,
  removeItem,
  removeShopItem,
  resetCart,
} = cartSlice.actions;
export const selectCartProducts = (state) => state.cart.products;

export default cartSlice.reducer;
