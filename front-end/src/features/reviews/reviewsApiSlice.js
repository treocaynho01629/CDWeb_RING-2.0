import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const reviewsAdapter = createEntityAdapter({});
const reviewsSelector = reviewsAdapter.getSelectors();
const initialState = reviewsAdapter.getInitialState({
    info: {
        currPage: 0,
        pageSize: 0,
        totalElements: 0,
        totalPages: 0,
    },
});

export const reviewsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getReviews: builder.query({
            query: (args) => {
                const { page, size, sortBy, sortDir } = args || {};

                //Params
                const params = new URLSearchParams();
                if (page) params.append('pageNo', page);
                if (size) params.append('pSize', size);
                if (sortBy) params.append('sortBy', sortBy);
                if (sortDir) params.append('sortDir', sortDir);
                // if (isEmployees) params.append('isEmployees', isEmployees);

                return {
                    url: `/api/reviews?${params.toString()}`,
                    validateStatus: (response, result) => {
                        return response.status === 200 && !result.isError
                    },
                }
            },
            transformResponse: responseData => {
                const { number, size, totalElements, totalPages, content } = responseData;
                return reviewsAdapter.setAll({
                    ...initialState,
                    info: {
                        currPage: number,
                        pageSize: size,
                        totalElements,
                        totalPages
                    }
                }, content)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'Review', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Review', id }))
                    ]
                } else return [{ type: 'Review', id: 'LIST' }]
            },
        }),
        getReviewsByBookId: builder.query({
            query: (args) => {
                const { id, page, size, sortBy, sortDir } = args || {};

                //Params
                const params = new URLSearchParams();
                if (page) params.append('pageNo', page);
                if (size) params.append('pSize', size);
                if (sortBy) params.append('sortBy', sortBy);
                if (sortDir) params.append('sortDir', sortDir);

                return {
                    url: `/api/reviews/${id}?${params.toString()}`,
                    validateStatus: (response, result) => {
                        return response.status === 200 && !result.isError
                    },
                }
            },
            transformResponse: responseData => {
                const { number, size, totalElements, totalPages, content } = responseData;
                return reviewsAdapter.setAll({
                    ...initialState,
                    info: {
                        currPage: number,
                        pageSize: size,
                        totalElements,
                        totalPages
                    }
                }, content)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'Review', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Review', id }))
                    ]
                } else return [{ type: 'Review', id: 'LIST' }]
            }
        }),
        getReviewsByUserId: builder.query({
            query: (args) => {
                const { id, page, size, sortBy, sortDir } = args || {};

                //Params
                const params = new URLSearchParams();
                if (page) params.append('pageNo', page);
                if (size) params.append('pSize', size);
                if (sortBy) params.append('sortBy', sortBy);
                if (sortDir) params.append('sortDir', sortDir);

                return {
                    url: `/api/reviews/user/${id}?${params.toString()}`,
                    validateStatus: (response, result) => {
                        return response.status === 200 && !result.isError
                    },
                }
            },
            transformResponse: responseData => {
                const { number, size, totalElements, totalPages, content } = responseData;
                return reviewsAdapter.setAll({
                    ...initialState,
                    info: {
                        currPage: number,
                        pageSize: size,
                        totalElements,
                        totalPages
                    }
                }, content)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'Review', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Review', id }))
                    ]
                } else return [{ type: 'Review', id: 'LIST' }]
            }
        }),
        getMyReviews: builder.query({
            query: (args) => {
                const { page, size, sortBy, sortDir } = args || {};

                //Params
                const params = new URLSearchParams();
                if (page) params.append('pageNo', page);
                if (size) params.append('pSize', size);
                if (sortBy) params.append('sortBy', sortBy);
                if (sortDir) params.append('sortDir', sortDir);

                return {
                    url: `/api/reviews/user?${params.toString()}`,
                    validateStatus: (response, result) => {
                        return response.status === 200 && !result.isError
                    },
                }
            },
            transformResponse: responseData => {
                const { number, size, totalElements, totalPages, content } = responseData;
                return reviewsAdapter.setAll({
                    ...initialState,
                    info: {
                        currPage: number,
                        pageSize: size,
                        totalElements,
                        totalPages
                    }
                }, content)
            },
            serializeQueryArgs: ({ endpointName }) => {
                return endpointName
            },
            merge: (currentCache, newItems) => {
                currentCache.info = newItems.info;
                reviewsAdapter.addMany(
                    currentCache, reviewsSelector.selectAll(newItems)
                )
            },
            forceRefetch: ({ currentArg, previousArg }) => {
                const isForceRefetch = (currentArg?.loadMore && (currentArg != previousArg))
                return isForceRefetch
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'Review', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Review', id }))
                    ]
                } else return [{ type: 'Review', id: 'LIST' }]
            }
        }),
        createReview: builder.mutation({
            query: ({ id, newReview }) => ({
                url: `/api/reviews/${id}`,
                method: 'POST',
                credentials: 'include',
                body: { ...newReview }
            }),
            invalidatesTags: [
                { type: 'Review', id: "LIST" }
            ]
        }),
        deleteReview: builder.mutation({
            query: (id) => ({
                url: `/api/reviews/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'Review', id }
            ]
        }),
        deleteReviews: builder.mutation({
            query: (ids) => ({
                url: `/api/reviews/delete-multiples?ids=${ids}`,
                method: 'DELETE'
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'Review', id: "LIST" }
            ]
        }),
        deleteAllReviews: builder.mutation({
            query: () => ({
                url: '/api/reviews/delete-all',
                method: 'DELETE'
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'Review', id: "LIST" }
            ]
        }),
    }),
})

export const {
    useGetReviewsQuery,
    useGetReviewsByBookIdQuery,
    useGetReviewsByUserIdQuery,
    useGetMyReviewsQuery,
    useCreateReviewMutation,
    useDeleteReviewMutation,
    useDeleteReviewsMutation,
    useDeleteAllReviewsMutation,
    usePrefetch: usePrefetchReviews
} = reviewsApiSlice

export const selectReviewsResult = reviewsApiSlice.endpoints.getReviews.select()

const selectReviewsData = createSelector(
    selectReviewsResult,
    reviewsResult => reviewsResult.data // normalized state object with ids & entities
)

export const {
    selectAll: selectAllReviews,
    selectById: selectReviewById,
    selectIds: selectReviewIds,
    selectEntities: selectReviewEntities
} = reviewsAdapter.getSelectors(state => selectReviewsData(state) ?? initialState)