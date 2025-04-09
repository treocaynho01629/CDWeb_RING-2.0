import { createEntityAdapter } from "@reduxjs/toolkit";
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
    getCoupons: builder.query({
      query: (args) => {
        const {
          types,
          shopId,
          userId,
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
        if (userId) params.append("userId", userId);
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
      merge: (currentCache, newItems, { arg: currentArg }) => {
        currentCache.page = newItems.page;
        if (!currentArg?.loadMore) couponsAdapter.removeAll(currentCache);
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
  }),
});
