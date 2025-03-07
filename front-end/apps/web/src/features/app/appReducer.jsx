import { createSlice } from "@reduxjs/toolkit";

const initialState = { keywords: [] };

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    addKeyword: (state, action) => {
      state.keywords.push(action.payload);
    },
    removeKeyword: (state, action) => {
      state.keywords = state.keywords.filter(
        (keyword) => keyword !== action.payload
      );
    },
  },
});

export const { addKeyword, removeKeyword } = appSlice.actions;
export const selectKeywords = (state) => state.app.keywords;

export default appSlice.reducer;
