import { createSlice } from "@reduxjs/toolkit";

const initialState = { //Bình thường để trống
  products: [],
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    //Thêm sản phẩm vào giỏ
    addToCart: (state, action) => {
      const item = state.products.find((item) => item.id === action.payload.id); //Lấy ID sản phẩm
      if (item) { //Nếu có sản phẩm trong giỏ rồi >> tăng số lượng
        item.quantity += action.payload.quantity;
      } else { //Chưa có >> bỏ mới vào giỏ
        state.products.push(action.payload);
      }
    },
    //Giảm số lượng sản phẩm
    decreaseQuantity: (state, action)=> {
      const item = state.products.find((item) => item.id === action.payload); //Lấy ID sản phẩm
      if (item) {
        if (item.quantity == 1){  //Nếu còn 1 => giảm về 0 >> bỏ khỏi giỏ
          state.products = state.products.filter(item => item.id !== action.payload)
        } else { //Giảm
          item.quantity --;
        }
      }
    },
    //Tăng số lượng sản phẩm
    increaseQuantity: (state, action)=> {
      const item = state.products.find((item) => item.id === action.payload); //Lấy ID sản phẩm
      if (item) { //Tăng
        item.quantity ++;
      }
    },
    //Đổi số lượng (Nhập)
    changeQuantity: (state, action)=> {
      const item = state.products.find((item) => item.id === action.payload.id); //Lấy ID sản phẩm
      if (item) {
        if (isNaN(action.payload.quantity)){ //Không phải số >> 1
          item.quantity = 1;
        } else if (action.payload.quantity < 1){ //Số âm >> bỏ khỏi giỏ
          state.products = state.products.filter(item => item.id !== action.payload.id)
        } else { //Đổi số lượng
          item.quantity = action.payload.quantity;
        }
      }
    },
    //Bỏ sản phẩm
    removeItem: (state, action) => {
      state.products = state.products.filter(item => item.id !== action.payload)
    },
    //Reset giỏ hàng
    resetCart: (state) => {
      state.products = []
    },
  },
});

export const { addToCart, increaseQuantity, decreaseQuantity, changeQuantity, removeItem, resetCart } = cartSlice.actions;

export default cartSlice.reducer;