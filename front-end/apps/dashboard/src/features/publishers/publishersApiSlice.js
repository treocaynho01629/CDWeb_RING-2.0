import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "@ring/redux";
import { isEqual } from "lodash-es";

const pubsAdapter = createEntityAdapter({});
const pubsSelector = pubsAdapter.getSelectors();
const initialState = pubsAdapter.getInitialState({
  page: {
    number: 0,
    size: 0,
    totalElements: 0,
    totalPages: 0,
  },
});

export const publishersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPublisher: builder.query({
      query: (id) => ({
        url: `/api/publishers/${id}`,
        validateStatus: (response, result) => {
          return response.status === 200 && !result?.isError;
        },
      }),
      providesTags: (result, error, { id }) => [{ type: "Publisher", id }],
    }),
    getPublishers: builder.query({
      query: (args) => {
        const { page, size, sortBy, sortDir } = args || {};

        //Params
        const params = new URLSearchParams();
        if (page) params.append("pageNo", page);
        if (size) params.append("pSize", size);
        if (sortBy) params.append("sortBy", sortBy);
        if (sortDir) params.append("sortDir", sortDir);

        return {
          url: `/api/publishers?${params.toString()}`,
          validateStatus: (response, result) => {
            return response.status === 200 && !result?.isError;
          },
        };
      },
      transformResponse: (responseData) => {
        const { content, page } = responseData;
        return pubsAdapter.setAll(
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
        pubsAdapter.addMany(currentCache, pubsSelector.selectAll(newItems));
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
    createPublisher: builder.mutation({
      query: (newPublisher) => ({
        url: "/api/publishers",
        method: "POST",
        credentials: "include",
        body: newPublisher,
        formData: true,
      }),
      invalidatesTags: [{ type: "Publisher", id: "LIST" }],
    }),
    updatePublisher: builder.mutation({
      query: ({ id, updatedPublisher }) => ({
        url: `/api/publishers/${id}`,
        method: "PUT",
        credentials: "include",
        body: updatedPublisher,
        formData: true,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Publisher", id }],
    }),
    deletePublisher: builder.mutation({
      query: (id) => ({
        url: `/api/publishers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Publisher", id }],
    }),
    deletePublishers: builder.mutation({
      query: (ids) => ({
        url: `/api/publishers/delete-multiples?ids=${ids}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error) => [{ type: "Publisher", id: "LIST" }],
    }),
    deleteAllPublishers: builder.mutation({
      query: () => ({
        url: "/api/publishers/delete-all",
        method: "DELETE",
      }),
      invalidatesTags: (result, error) => [{ type: "Publisher", id: "LIST" }],
    }),
  }),
});

export const {
  useGetPublisherQuery,
  useGetPublishersQuery,
  useCreatePublisherMutation,
  useUpdatePublisherMutation,
  useDeletePublisherMutation,
  useDeletePublishersMutation,
  useDeleteAllPublishersMutation,
} = publishersApiSlice;

export const selectPublishersResult =
  publishersApiSlice.endpoints.getPublishers.select();

const selectPublishersData = createSelector(
  selectPublishersResult,
  (pubsResult) => pubsResult.data,
);

export const {
  selectAll: selectAllPublisher,
  selectById: selectPublisherById,
  selectIds: selectPublisherIds,
  selectEntities: selectPublisherEntities,
} = pubsAdapter.getSelectors(
  (state) => selectPublishersData(state) ?? initialState,
);
