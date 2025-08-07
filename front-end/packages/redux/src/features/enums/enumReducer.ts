import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../lib/store";

const initialState = { enums: null };

export const enumSlice = createSlice({
  name: "enum",
  initialState,
  reducers: {
    importEnums: (state, action) => {
      const { entities } = action.payload;
      state.enums = entities;
    },
    resetEnums: (state) => {
      state.enums = null;
    },
  },
});

export const { importEnums, resetEnums } = enumSlice.actions;
export const selectEnums = (state: RootState) => state.enum.enums;

export default enumSlice.reducer;
