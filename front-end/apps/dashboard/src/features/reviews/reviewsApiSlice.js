import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "@ring/redux";
import { isEqual } from "lodash-es";

const reviewsAdapter = createEntityAdapter({});
const reviewsSelector = reviewsAdapter.getSelectors();
const initialState = reviewsAdapter.getInitialState({
  page: {
    number: 0,
    size: 0,
    totalElements: 0,
    totalPages: 0,
  },
});

export const reviewsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getReviews: builder.query({
      query: (args) => {
        const { page, size, sortBy, sortDir, rating, keyword, bookId, userId } =
          args || {};

        //Params
        const params = new URLSearchParams();
        if (page) params.append("pageNo", page);
        if (size) params.append("pSize", size);
        if (sortBy) params.append("sortBy", sortBy);
        if (sortDir) params.append("sortDir", sortDir);
        if (rating) params.append("rating", rating);
        if (keyword) params.append("keyword", keyword);
        if (bookId) params.append("bookId", bookId);
        if (userId) params.append("userId", userId);

        return {
          url: `/api/reviews?${params.toString()}`,
          validateStatus: (response, result) => {
            return response.status === 200 && !result?.isError;
          },
        };
      },
      transformResponse: (responseData) => {
        const { content, page } = responseData;
        return reviewsAdapter.setAll(
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
            { type: "Review", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Review", id })),
          ];
        } else return [{ type: "Review", id: "LIST" }];
      },
    }),
    deleteReview: builder.mutation({
      query: (id) => ({
        url: `/api/reviews/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Review", id }],
    }),
    deleteReviews: builder.mutation({
      query: (ids) => ({
        url: `/api/reviews/delete-multiples?ids=${ids}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error) => [{ type: "Review", id: "LIST" }],
    }),
    deleteReviewsInverse: builder.mutation({
      query: (args) => {
        const { rating, keyword, bookId, userId, ids } = args || {};

        //Params
        const params = new URLSearchParams();
        if (rating) params.append("rating", rating);
        if (keyword) params.append("keyword", keyword);
        if (bookId) params.append("bookId", bookId);
        if (userId) params.append("userId", userId);
        if (ids?.length) params.append("ids", ids);

        return {
          url: `/api/reviews/delete-inverse?${params.toString()}`,
          method: "DELETE",
          validateStatus: (response, result) => {
            return response.status === 200 && !result?.isError;
          },
          responseHandler: "text",
        };
      },
      invalidatesTags: (result, error) => [{ type: "Review", id: "LIST" }],
    }),
    deleteAllReviews: builder.mutation({
      query: () => ({
        url: "/api/reviews/delete-all",
        method: "DELETE",
      }),
      invalidatesTags: (result, error) => [{ type: "Review", id: "LIST" }],
    }),
  }),
});

export const {
  useGetReviewsQuery,
  useDeleteReviewMutation,
  useDeleteReviewsMutation,
  useDeleteReviewsInverseMutation,
  useDeleteAllReviewsMutation,
  usePrefetch: usePrefetchReviews,
} = reviewsApiSlice;

export const selectReviewsResult =
  reviewsApiSlice.endpoints.getReviews.select();

const selectReviewsData = createSelector(
  selectReviewsResult,
  (reviewsResult) => reviewsResult.data // normalized state object with ids & entities
);

export const {
  selectAll: selectAllReviews,
  selectById: selectReviewById,
  selectIds: selectReviewIds,
  selectEntities: selectReviewEntities,
} = reviewsAdapter.getSelectors(
  (state) => selectReviewsData(state) ?? initialState
);
