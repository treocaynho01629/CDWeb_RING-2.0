import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "@ring/redux";
import { isEqual } from "lodash-es";
import { defaultSerializeQueryArgs } from "@reduxjs/toolkit/query";

const ordersAdapter = createEntityAdapter({});
const ordersSelector = ordersAdapter.getSelectors();
const initialState = ordersAdapter.getInitialState({
  page: {
    number: 0,
    size: 0,
    totalElements: 0,
    totalPages: 0,
  },
});

export const ordersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getReceipt: builder.query({
      query: (id) => ({
        url: `/api/orders/receipts/${id}`,
        validateStatus: (response, result) => {
          return response.status === 200 && !result?.isError;
        },
      }),
      providesTags: (result, error, id) => [{ type: "Order", id }],
    }),
    getReceipts: builder.query({
      query: (args) => {
        const { status, keyword, shopId, page, size, sortBy, sortDir } =
          args || {};

        //Params
        const params = new URLSearchParams();
        if (shopId) params.append("shopId", shopId);
        if (status) params.append("status", status);
        if (keyword) params.append("keyword", keyword);
        if (page) params.append("pageNo", page);
        if (size) params.append("pSize", size);
        if (sortBy) params.append("sortBy", sortBy);
        if (sortDir) params.append("sortDir", sortDir);

        return {
          url: `/api/orders/receipts?${params.toString()}`,
          validateStatus: (response, result) => {
            return response.status === 200 && !result?.isError;
          },
        };
      },
      transformResponse: (responseData) => {
        const { content, page } = responseData;
        return ordersAdapter.setAll(
          {
            ...initialState,
            page,
          },
          content
        );
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "Order", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Order", id })),
          ];
        } else return [{ type: "Order", id: "LIST" }];
      },
    }),
    getOrdersByBookId: builder.query({
      query: (args) => {
        const { id, page, size, sortBy, sortDir } = args || {};

        //Params
        const params = new URLSearchParams();
        if (page) params.append("pageNo", page);
        if (size) params.append("pSize", size);
        if (sortBy) params.append("sortBy", sortBy);
        if (sortDir) params.append("sortDir", sortDir);

        return {
          url: `/api/orders/book/${id}?${params.toString()}`,
          validateStatus: (response, result) => {
            return response.status === 200 && !result?.isError;
          },
        };
      },
      transformResponse: (responseData) => {
        const { content, page } = responseData;
        return ordersAdapter.setAll(
          {
            ...initialState,
            page,
          },
          content
        );
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "Order", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Order", id })),
          ];
        } else return [{ type: "Order", id: "LIST" }];
      },
    }),
    getSummaries: builder.query({
      query: (args) => {
        const { shopId, bookId, page, size, sortBy, sortDir } = args || {};

        //Params
        const params = new URLSearchParams();
        if (shopId) params.append("shopId", shopId);
        if (page) params.append("bookId", bookId);
        if (page) params.append("pageNo", page);
        if (size) params.append("pSize", size);
        if (sortBy) params.append("sortBy", sortBy);
        if (sortDir) params.append("sortDir", sortDir);

        return {
          url: `/api/orders/summaries?${params.toString()}`,
          validateStatus: (response, result) => {
            return response.status === 200 && !result?.isError;
          },
        };
      },
      transformResponse: (responseData) => {
        const { content, page } = responseData;
        return ordersAdapter.setAll(
          {
            ...initialState,
            page,
          },
          content
        );
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "Order", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Order", id })),
          ];
        } else return [{ type: "Order", id: "LIST" }];
      },
    }),
    getSalesAnalytics: builder.query({
      query: (shopId) => {
        return {
          url: `/api/orders/analytics${shopId ? `?shopId=${shopId}` : ""}`,
          validateStatus: (response, result) => {
            return response.status === 200 && !result?.isError;
          },
        };
      },
      providesTags: [{ type: "Order", id: "LIST" }],
    }),
    getSales: builder.query({
      query: (args) => {
        const { shopId, year } = args || {};

        //Params
        const params = new URLSearchParams();
        if (shopId) params.append("shopId", shopId);
        if (year) params.append("year", year);

        return {
          url: `/api/orders/sales?${params.toString()}`,
          validateStatus: (response, result) => {
            return response.status === 200 && !result?.isError;
          },
        };
      },
      providesTags: [{ type: "Order", id: "LIST" }],
    }),
    changeOrderStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/api/orders/status/${id}?status=${status}`,
        method: "PUT",
        credentials: "include",
        responseHandler: "text",
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Order", id }],
    }),
  }),
});

export const {
  useGetReceiptQuery,
  useGetReceiptsQuery,
  useGetOrdersByBookIdQuery,
  useGetSummariesQuery,
  useGetSalesAnalyticsQuery,
  useGetSalesQuery,
  useChangeOrderStatusMutation,
} = ordersApiSlice;

export const selectReceiptsResult =
  ordersApiSlice.endpoints.getReceipts.select();

const selectReceiptsData = createSelector(
  selectReceiptsResult,
  (receiptsResult) => receiptsResult.data // normalized state object with ids & entities
);

export const {
  selectAll: selectAllReceipts,
  selectById: selectReceiptById,
  selectIds: selectReceiptIds,
  selectEntities: selectReceiptEntities,
} = ordersAdapter.getSelectors(
  (state) => selectReceiptsData(state) ?? initialState
);
