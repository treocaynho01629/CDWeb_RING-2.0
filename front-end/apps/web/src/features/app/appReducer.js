import { createSlice } from "@reduxjs/toolkit";

const initialState = { keywords: [] };

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    addKeyword: (state, action) => {
      if (action.payload == "") return;
      if (state.keywords.indexOf(action.payload) == -1) {
        state.keywords.push(action.payload);
      }
      if (state.keywords.length >= 13) {
        state.keywords.splice(0, 1);
      }
    },
    removeKeyword: (state, action) => {
      state.keywords = state.keywords.filter(
        (keyword) => keyword !== action.payload
      );
    },
    resetKeywords: (state) => {
      state.keywords = [];
    },
  },
});

export const { addKeyword, removeKeyword, resetKeywords } = appSlice.actions;
export const selectKeywords = (state) => state.app.keywords;

export default appSlice.reducer;
