import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "@ring/redux";
import { defaultSerializeQueryArgs } from "@reduxjs/toolkit/query";
import { isEqual } from "lodash-es";

const couponsAdapter = createEntityAdapter({});
const couponsSelector = couponsAdapter.getSelectors();
const initialState = couponsAdapter.getInitialState({
  page: {
    number: 0,
    size: 0,
    totalElements: 0,
    totalPages: 0,
  },
});

export const couponsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCoupon: builder.query({
      query: (id) => ({
        url: `/api/coupons/${id}`,
        validateStatus: (response, result) => {
          return response.status === 200 && !result?.isError;
        },
      }),
      providesTags: (result, error) => [
        result ? { type: "Coupon", id: result.id } : { type: "Coupon" },
      ],
    }),
    getCoupons: builder.query({
      query: (args) => {
        const {
          types,
          shopId,
          byShop,
          showExpired,
          codes,
          code,
          cValue,
          cQuantity,
          page,
          size,
          sortBy,
          sortDir,
        } = args || {};

        //Params
        const params = new URLSearchParams();
        if (types?.length > 0) params.append("types", types);
        if (shopId) params.append("shopId", shopId);
        if (byShop != null) params.append("byShop", byShop);
        if (showExpired) params.append("showExpired", showExpired);
        if (codes?.length > 0) params.append("codes", codes);
        if (code) params.append("code", code);
        if (page) params.append("pageNo", page);
        if (size) params.append("pSize", size);
        if (sortBy) params.append("sortBy", sortBy);
        if (sortDir) params.append("sortDir", sortDir);
        if (cValue) params.append("cValue", cValue);
        if (cQuantity) params.append("cQuantity", cQuantity);

        return {
          url: `/api/coupons?${params.toString()}`,
          validateStatus: (response, result) => {
            return response.status === 200 && !result?.isError;
          },
        };
      },
      transformResponse: (responseData) => {
        const { content, page } = responseData;
        return couponsAdapter.setAll(
          {
            ...initialState,
            page,
          },
          content
        );
      },
      serializeQueryArgs: ({ endpointName, queryArgs, endpointDefinition }) => {
        if (queryArgs) {
          const { loadMore, ...mainQuery } = queryArgs;

          if (loadMore) {
            //Load more >> serialize without <pagination>
            const { page, size, ...rest } = mainQuery;
            if (JSON.stringify(rest) === "{}") return endpointName + "Merge";
            return defaultSerializeQueryArgs({
              endpointName: endpointName + "Merge",
              queryArgs: rest,
              endpointDefinition,
            });
          }

          //Serialize like normal
          if (JSON.stringify(mainQuery) === "{}") return endpointName;
          return defaultSerializeQueryArgs({
            endpointName,
            queryArgs: mainQuery,
            endpointDefinition,
          });
        } else {
          return endpointName;
        }
      },
      merge: (currentCache, newItems) => {
        currentCache.page = newItems.page;
        couponsAdapter.upsertMany(
          currentCache,
          couponsSelector.selectAll(newItems)
        );
      },
      forceRefetch: ({ currentArg, previousArg }) => {
        const isForceRefetch =
          currentArg?.loadMore &&
          !isEqual(currentArg, previousArg) &&
          currentArg?.page > previousArg?.page;
        return isForceRefetch;
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "Coupon", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Coupon", id })),
          ];
        } else return [{ type: "Coupon", id: "LIST" }];
      },
    }),
    getCouponAnalytics: builder.query({
      query: (shopId) => {
        return {
          url: `/api/coupons/analytics${shopId ? `?shopId=${shopId}` : ""}`,
          validateStatus: (response, result) => {
            return response.status === 200 && !result?.isError;
          },
        };
      },
      providesTags: [{ type: "Coupon", id: "LIST" }],
    }),
    createCoupon: builder.mutation({
      query: (newCoupon) => ({
        url: "/api/coupons",
        method: "POST",
        credentials: "include",
        body: {
          ...newCoupon,
        },
      }),
      invalidatesTags: [{ type: "Coupon", id: "LIST" }],
    }),
    updateCoupon: builder.mutation({
      query: ({ id, updatedCoupon }) => ({
        url: `/api/coupons/${id}`,
        method: "PUT",
        credentials: "include",
        body: {
          ...updatedCoupon,
        },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Coupon", id }],
    }),
    deleteCoupon: builder.mutation({
      query: (id) => ({
        url: `/api/coupons/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Coupon", id }],
    }),
    deleteCoupons: builder.mutation({
      query: (ids) => ({
        url: `/api/coupons/delete-multiples?ids=${ids}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error) => [{ type: "Coupon", id: "LIST" }],
    }),
    deleteCouponsInverse: builder.mutation({
      query: (args) => {
        const { types, shopId, byShop, showExpired, codes, code, ids } =
          args || {};

        //Params
        const params = new URLSearchParams();
        if (types) params.append("types", types);
        if (shopId) params.append("shopId", shopId);
        if (byShop != null) params.append("byShop", byShop);
        if (showExpired) params.append("showExpired", showExpired);
        if (codes?.length > 0) params.append("codes", codes);
        if (code) params.append("code", code);
        if (ids?.length) params.append("ids", ids);

        return {
          url: `/api/coupons/delete-multiples?${params.toString()}`,
          method: "DELETE",
        };
      },
      invalidatesTags: (result, error) => [{ type: "Coupon", id: "LIST" }],
    }),
    deleteAllCoupons: builder.mutation({
      query: (shopId) => ({
        url: `/api/coupons/delete-all?shopId=${shopId}`,
        method: "DELETE",
        responseHandler: "text",
      }),
      invalidatesTags: (result, error) => [{ type: "Coupon", id: "LIST" }],
    }),
  }),
});

export const {
  useGetCouponQuery,
  useGetCouponsQuery,
  useGetCouponAnalyticsQuery,
  useCreateCouponMutation,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
  useDeleteCouponsMutation,
  useDeleteCouponsInverseMutation,
  useDeleteAllCouponsMutation,
} = couponsApiSlice;

export const selectCouponsResult =
  couponsApiSlice.endpoints.getCoupons.select();

const selectCouponsData = createSelector(
  selectCouponsResult,
  (couponsResult) => couponsResult.data
);

export const {
  selectAll: selectAllCoupon,
  selectById: selectCouponById,
  selectIds: selectCouponIds,
  selectEntities: selectCouponEntities,
} = couponsAdapter.getSelectors(
  (state) => selectCouponsData(state) ?? initialState
);
