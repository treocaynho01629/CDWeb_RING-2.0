import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const reviewsAdapter = createEntityAdapter({});
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
                const { page, size, sortBy, sortDir, rating, bookId, userId } = args || {};

                //Params
                const params = new URLSearchParams();
                if (page) params.append('pageNo', page);
                if (size) params.append('pSize', size);
                if (sortBy) params.append('sortBy', sortBy);
                if (sortDir) params.append('sortDir', sortDir);
                if (rating) params.append('rating', rating);
                if (bookId) params.append('bookId', bookId);
                if (userId) params.append('userId', userId);

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
        getReviewByBookId: builder.query({
            query: (id) => ({
                url: `/api/reviews/book/${id}`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
            }),
            providesTags: (result, error, id) => [{ type: 'Review', id }]
        }),
        getReviewsByBookId: builder.query({
            query: (args) => {
                const { id, page, size, sortBy, sortDir, rating } = args || {};

                //Params
                const params = new URLSearchParams();
                if (page) params.append('pageNo', page);
                if (size) params.append('pSize', size);
                if (sortBy) params.append('sortBy', sortBy);
                if (sortDir) params.append('sortDir', sortDir);
                if (rating) params.append('rating', rating);

                return {
                    url: `/api/reviews/books/${id}?${params.toString()}`,
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
                const { page, size, sortBy, sortDir, rating } = args || {};

                //Params
                const params = new URLSearchParams();
                if (page) params.append('pageNo', page);
                if (size) params.append('pSize', size);
                if (sortBy) params.append('sortBy', sortBy);
                if (sortDir) params.append('sortDir', sortDir);
                if (rating) params.append('rating', rating);

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
            serializeQueryArgs: ({ endpointName, queryArgs, endpointDefinition }) => {
                if (queryArgs) {
                    const { loadMore, ...mainQuery } = queryArgs;

                    if (loadMore) { //Load more >> serialize without <pagination>
                        const { page, size, ...rest } = mainQuery;
                        if (JSON.stringify(rest) === "{}") return endpointName + 'Merge';
                        return defaultSerializeQueryArgs({
                            endpointName: endpointName + 'Merge',
                            queryArgs: rest,
                            endpointDefinition
                        });
                    }

                    //Serialize like normal
                    if (JSON.stringify(mainQuery) === "{}") return endpointName;
                    return defaultSerializeQueryArgs({
                        endpointName,
                        queryArgs: mainQuery,
                        endpointDefinition
                    })
                } else {
                    return endpointName
                }
            },
            merge: (currentCache, newItems) => {
                currentCache.info = newItems.info;
                reviewsAdapter.upsertMany(
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
        updateReview: builder.mutation({
            query: ({ id, updateReview }) => ({
                url: `/api/reviews/${id}`,
                method: 'PUT',
                credentials: 'include',
                body: updateReview,
                formData: true,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Review', id }
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
            invalidatesTags: (result, error) => [
                { type: 'Review', id: "LIST" }
            ]
        }),
        deleteAllReviews: builder.mutation({
            query: () => ({
                url: '/api/reviews/delete-all',
                method: 'DELETE'
            }),
            invalidatesTags: (result, error) => [
                { type: 'Review', id: "LIST" }
            ]
        }),
    }),
})

export const {
    useGetReviewsQuery,
    useGetReviewByBookIdQuery,
    useGetReviewsByBookIdQuery,
    useGetMyReviewsQuery,
    useCreateReviewMutation,
    useUpdateReviewMutation,
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