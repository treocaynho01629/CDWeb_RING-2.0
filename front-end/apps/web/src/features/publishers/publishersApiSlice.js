import { defaultSerializeQueryArgs } from "@reduxjs/toolkit/query";
import {
  publishersApiSlice as initialsApiSlice,
  pubsInitialState as initialState,
  pubsAdapter,
  pubsSelector,
} from "@ring/redux";
import { isEqual } from "lodash-es";

export const publishersApiSlice = initialsApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRelevantPublishers: builder.query({
      query: (args) => {
        const { page, size, cateId } = args || {};

        //Params
        const params = new URLSearchParams();
        if (page) params.append("pageNo", page);
        if (size) params.append("pSize", size);

        return {
          url: `/api/publishers/relevant/${cateId}?${params.toString()}`,
          validateStatus: (response, result) => {
            return response.status === 200 && !result?.isError;
          },
        };
      },
      transformResponse: (responseData) => {
        const { content, empty, page, size, totalElements, totalPages } =
          responseData;
        return pubsAdapter.setAll(
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
        if (!currentArg?.loadMore) pubsAdapter.removeAll(currentCache);
        pubsAdapter.upsertMany(currentCache, pubsSelector.selectAll(newItems));
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
            { type: "Publisher", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Publisher", id })),
          ];
        } else return [{ type: "Publisher", id: "LIST" }];
      },
    }),
  }),
});

export const {
  useGetPublisherQuery,
  useGetPublishersQuery,
  useGetRelevantPublishersQuery,
} = publishersApiSlice;
