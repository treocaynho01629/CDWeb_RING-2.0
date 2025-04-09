import { createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "@ring/redux";
import { defaultSerializeQueryArgs } from "@reduxjs/toolkit/query";
import { isEqual } from "lodash-es";

const booksAdapter = createEntityAdapter({});
const booksSelector = booksAdapter.getSelectors();
const initialState = booksAdapter.getInitialState({
  page: {
    number: 0,
    size: 0,
    totalElements: 0,
    totalPages: 0,
  },
});

export const booksApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBooks: builder.query({
      query: (args) => {
        const {
          page,
          size,
          sortBy,
          sortDir,
          keyword,
          cateId,
          rating,
          amount,
          pubIds,
          types,
          shopId,
          userId,
          value,
          withDesc,
        } = args || {};

        //Params
        const params = new URLSearchParams();
        if (page) params.append("pageNo", page);
        if (size) params.append("pSize", size);
        if (sortBy) params.append("sortBy", sortBy);
        if (sortDir) params.append("sortDir", sortDir);
        if (keyword) params.append("keyword", keyword);
        if (cateId) params.append("cateId", cateId);
        if (rating) params.append("rating", rating);
        if (amount != null) params.append("amount", amount);
        if (types?.length) params.append("types", types);
        if (shopId) params.append("shopId", shopId);
        if (userId) params.append("userId", userId);
        if (withDesc) params.append("withDesc", withDesc);
        if (pubIds?.length) params.append("pubIds", pubIds);
        if (value) {
          if (value[0] != 0) params.append("fromRange", value[0]);
          if (value[1] != 10000000) params.append("toRange", value[1]);
        }

        return {
          url: `/api/books?${params.toString()}`,
          validateStatus: (response, result) => {
            return response.status === 200 && !result?.isError;
          },
        };
      },
      transformResponse: (responseData) => {
        const { content, page } = responseData;
        return booksAdapter.setAll(
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
        if (!currentArg?.loadMore) booksAdapter.removeAll(currentCache);
        booksAdapter.upsertMany(
          currentCache,
          booksSelector.selectAll(newItems)
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
            { type: "Book", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Book", id })),
          ];
        } else return [{ type: "Book", id: "LIST" }];
      },
    }),
  }),
});
