import { createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "@ring/redux";

const ordersAdapter = createEntityAdapter({});
const initialState = ordersAdapter.getInitialState({
  empty: false,
  page: 0,
  size: 0,
  totalElements: 0,
  totalPages: 0,
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
      providesTags: (result, error, id) => [{ type: "Receipt", id }],
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
        const { content, empty, page, size, totalElements, totalPages } =
          responseData;
        return ordersAdapter.setAll(
          {
            ...initialState,
            empty,
            page,
            size,
            totalElements,
            totalPages,
          },
          content
        );
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "Order", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Receipt", id })),
          ];
        } else return [{ type: "Receipt", id: "LIST" }];
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
        const { content, empty, page, size, totalElements, totalPages } =
          responseData;
        return ordersAdapter.setAll(
          {
            ...initialState,
            empty,
            page,
            size,
            totalElements,
            totalPages,
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
        const { content, empty, page, size, totalElements, totalPages } =
          responseData;
        return ordersAdapter.setAll(
          {
            ...initialState,
            empty,
            page,
            size,
            totalElements,
            totalPages,
          },
          content
        );
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "Receipt", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Receipt", id })),
          ];
        } else return [{ type: "Receipt", id: "LIST" }];
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
