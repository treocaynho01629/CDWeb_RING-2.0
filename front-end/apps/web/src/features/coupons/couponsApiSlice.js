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
      query: (args) => {
        const { code, cValue, cQuantity } = args || {};

        //Params
        const params = new URLSearchParams();
        if (cValue) params.append("cValue", cValue);
        if (cQuantity) params.append("cQuantity", cQuantity);

        return {
          url: `/api/coupons/${code}?${params.toString()}`,
          validateStatus: (response, result) => {
            return response.status === 200 && !result?.isError;
          },
        };
      },
      providesTags: (result, error) => [
        result ? { type: "Coupon", id: result.id } : { type: "Coupon" },
      ],
    }),
    getCoupons: builder.query({
      query: (args) => {
        const {
          types,
          shop,
          byShop,
          showExpired,
          cValue,
          cQuantity,
          page,
          size,
          sortBy,
          sortDir,
        } = args || {};

        //Params
        const params = new URLSearchParams();
        if (types) params.append("types", types);
        if (shop) params.append("shopId", shop);
        if (byShop != null) params.append("byShop", byShop);
        if (showExpired != null) params.append("showExpired", showExpired);
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
          content,
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
          couponsSelector.selectAll(newItems),
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
    getRecommendCoupons: builder.query({
      query: (args) => {
        const { shopIds } = args || {};

        //Params
        const params = new URLSearchParams();
        if (shopIds) params.append("shopIds", shopIds);

        return {
          url: `/api/coupons/recommend?${params.toString()}`,
          validateStatus: (response, result) => {
            return response.status === 200 && !result?.isError;
          },
        };
      },
      transformResponse: (responseData) => {
        return couponsAdapter.setAll(initialState, responseData ?? {});
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
  }),
});

export const {
  useGetCouponQuery,
  useGetCouponsQuery,
  useGetRecommendCouponsQuery,
} = couponsApiSlice;

export const selectCouponsResult =
  couponsApiSlice.endpoints.getCoupons.select();

const selectCouponsData = createSelector(
  selectCouponsResult,
  (couponsResult) => couponsResult.data,
);

export const {
  selectAll: selectAllCoupon,
  selectById: selectCouponById,
  selectIds: selectCouponIds,
  selectEntities: selectCouponEntities,
} = couponsAdapter.getSelectors(
  (state) => selectCouponsData(state) ?? initialState,
);
