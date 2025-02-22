import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "@ring/redux";

const shopsAdapter = createEntityAdapter({});
const initialState = shopsAdapter.getInitialState({
  page: {
    number: 0,
    size: 0,
    totalElements: 0,
    totalPages: 0,
  },
});

export const shopsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getShop: builder.query({
      query: (id) => ({
        url: `/api/shops/detail/${id}`,
        validateStatus: (response, result) => {
          return response.status === 200 && !result?.isError;
        },
      }),
      providesTags: (result, error, { id }) => [{ type: "Shop", id }],
    }),
    getShops: builder.query({
      query: (args) => {
        const { page, size, sortBy, sortDir, keyword, userId } = args || {};

        //Params
        const params = new URLSearchParams();
        if (page) params.append("pageNo", page);
        if (size) params.append("pSize", size);
        if (sortBy) params.append("sortBy", sortBy);
        if (sortDir) params.append("sortDir", sortDir);
        if (keyword) params.append("keyword", keyword);
        if (userId) params.append("userId", userId);

        return {
          url: `/api/shops?${params.toString()}`,
          validateStatus: (response, result) => {
            return response.status === 200 && !result?.isError;
          },
        };
      },
      transformResponse: (responseData) => {
        const { content, page } = responseData;
        return shopsAdapter.setAll(
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
            { type: "Shop", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Shop", id })),
          ];
        } else return [{ type: "Shop", id: "LIST" }];
      },
    }),
    getPreviewShops: builder.query({
      query: () => {
        return {
          url: "/api/shops/preview",
          validateStatus: (response, result) => {
            return response.status === 200 && !result?.isError;
          },
        };
      },
      transformResponse: (responseData) => {
        return shopsAdapter.setAll(initialState, responseData ?? {});
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "Shop", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Shop", id })),
          ];
        } else return [{ type: "Shop", id: "LIST" }];
      },
    }),
    getShopAnalytics: builder.query({
      query: () => {
        return {
          url: "/api/shops/analytics",
          validateStatus: (response, result) => {
            return response.status === 200 && !result?.isError;
          },
        };
      },
      providesTags: [{ type: "Shop", id: "LIST" }],
    }),
    createShop: builder.mutation({
      query: (newShop) => ({
        url: "/api/shops",
        method: "POST",
        credentials: "include",
        body: newShop,
        formData: true,
      }),
      invalidatesTags: [{ type: "Shop", id: "LIST" }],
    }),
    updateShop: builder.mutation({
      query: ({ id, updatedShop }) => ({
        url: `/api/shops/${id}`,
        method: "PUT",
        credentials: "include",
        body: updatedShop,
        formData: true,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Shop", id }],
    }),
    deleteShop: builder.mutation({
      query: (id) => ({
        url: `/api/shops/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Shop", id }],
    }),
    deleteShops: builder.mutation({
      query: (ids) => ({
        url: `/api/shops/delete-multiples?ids=${ids}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error) => [{ type: "Shop", id: "LIST" }],
    }),
    deleteShopsInverse: builder.mutation({
      query: (args) => {
        const { keyword, userId, ids } = args || {};

        //Params
        const params = new URLSearchParams();
        if (keyword) params.append("keyword", keyword);
        if (userId) params.append("userId", userId);
        if (ids?.length) params.append("ids", ids);

        return {
          url: `/api/shops/delete-inverse?${params.toString()}`,
          method: "DELETE",
          validateStatus: (response, result) => {
            return response.status === 200 && !result?.isError;
          },
          responseHandler: "text",
        };
      },
      invalidatesTags: (result, error) => [{ type: "Shop", id: "LIST" }],
    }),
    deleteAllShops: builder.mutation({
      query: () => ({
        url: "/api/shops/delete-all",
        method: "DELETE",
      }),
      invalidatesTags: (result, error) => [{ type: "Shop", id: "LIST" }],
    }),
  }),
});

export const {
  useGetShopQuery,
  useGetShopsQuery,
  useGetPreviewShopsQuery,
  useGetShopAnalyticsQuery,
  useCreateShopMutation,
  useUpdateShopMutation,
  useDeleteShopMutation,
  useDeleteShopsMutation,
  useDeleteShopsInverseMutation,
  useDeleteAllShopsMutation,
  usePrefetch: usePrefetchShops,
} = shopsApiSlice;

export const selectShopsResult = shopsApiSlice.endpoints.getShops.select();

const selectShopsData = createSelector(
  selectShopsResult,
  (shopsResult) => shopsResult.data // normalized state object with ids & entities
);

export const {
  selectAll: selectAllShops,
  selectById: selectShopById,
  selectIds: selectShopIds,
  selectEntities: selectShopEntities,
} = shopsAdapter.getSelectors(
  (state) => selectShopsData(state) ?? initialState
);
