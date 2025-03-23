import { apiSlice } from "../../app/apiSlice";
import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";

const enumsAdapter = createEntityAdapter({});
const initialState = enumsAdapter.getInitialState();

export const enumsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getEnums: builder.query({
      query: () => ({
        url: "/api/v1/enums",
        validateStatus: (response, result) => {
          return response.status === 200 && !result?.isError;
        },
      }),
      transformResponse: (responseData) => {
        const loadedEnums = responseData.map((e) => {
          e.id = e.name;
          return e;
        });
        return enumsAdapter.setAll(initialState, loadedEnums);
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "Enum", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Enum", id })),
          ];
        } else return [{ type: "Enum", id: "LIST" }];
      },
    }),
  }),
});

export const { useGetEnumsQuery } = enumsApiSlice;

export const selectEnumsResult = enumsApiSlice.endpoints.getEnums.select();

const selectEnumsData = createSelector(
  selectEnumsResult,
  (enumsResult) => enumsResult.data
);

export const {
  selectAll: selectAllEnum,
  selectById: selectEnumById,
  selectIds: selectEnumIds,
  selectEntities: selectEnumEntities,
} = enumsAdapter.getSelectors(
  (state) => selectEnumsData(state) ?? initialState
);
