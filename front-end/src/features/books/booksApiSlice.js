import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";
import { defaultSerializeQueryArgs } from "@reduxjs/toolkit/query";

const booksAdapter = createEntityAdapter({});
const booksSelector = booksAdapter.getSelectors();
const initialState = booksAdapter.getInitialState({
    info: {
        currPage: 0,
        pageSize: 0,
        totalElements: 0,
        totalPages: 0,
    },
});

export const booksApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getBook: builder.query({
            query: ({ id, slug }) => ({
                url: `/api/books/${slug ? 'slug/' + slug : id ? id : ''}`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
            }),
            providesTags: (result, error) => [{ type: 'Book', id: result.id }]
        }),
        getBooks: builder.query({
            query: (args) => {
                const { page, size, sortBy, sortDir, keyword, cateId, rating, 
                    amount, pubId, type, shopId, sellerId, value } = args || {};

                //Params
                const params = new URLSearchParams();
                if (page) params.append('pageNo', page);
                if (size) params.append('pSize', size);
                if (sortBy) params.append('sortBy', sortBy);
                if (sortDir) params.append('sortDir', sortDir);
                if (keyword) params.append('keyword', keyword);
                if (cateId) params.append('cateId', cateId);
                if (rating) params.append('rating', rating);
                if (amount) params.append('amount', amount);
                if (type) params.append('type', type);
                if (shopId) params.append('shopId', shopId);
                if (sellerId) params.append('sellerId', sellerId);
                if (pubId?.length) params.append('pubId', pubId);
                if (value) {
                    params.append('fromRange', value[0]);
                    params.append('toRange', value[1]);
                }

                return {
                    url: `/api/books?${params.toString()}`,
                    validateStatus: (response, result) => {
                        return response.status === 200 && !result.isError
                    },
                }
            },
            transformResponse: responseData => {
                const { number, size, totalElements, totalPages, content } = responseData;
                return booksAdapter.setAll({
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
                booksAdapter.upsertMany(
                    currentCache, booksSelector.selectAll(newItems)
                )
            },
            forceRefetch: ({ currentArg, previousArg }) => {
                const isForceRefetch = (currentArg?.loadMore && (currentArg != previousArg))
                return isForceRefetch
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'Book', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Book', id }))
                    ]
                } else return [{ type: 'Book', id: 'LIST' }]
            }
        }),
        getRandomBooks: builder.query({
            query: (args) => {
                const { amount } = args || {};

                return {
                    url: `/api/books/random${amount ? '?amount=' + amount : ''}`,
                    validateStatus: (response, result) => {
                        return response.status === 200 && !result.isError
                    },
                }
            },
            transformResponse: responseData => {
                return booksAdapter.setAll(initialState, responseData)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'Book', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Book', id }))
                    ]
                } else return [{ type: 'Book', id: 'LIST' }]
            }
        }),
        createBook: builder.mutation({
            query: (newBook) => ({
                url: '/api/books',
                method: 'POST',
                credentials: 'include',
                body: newBook,
                formData: true,
            }),
            invalidatesTags: [
                { type: 'Book', id: "LIST" }
            ]
        }),
        updateBook: builder.mutation({
            query: ({ id, updatedBook }) => ({
                url: `/api/books/${id}`,
                method: 'PUT',
                credentials: 'include',
                body: updatedBook,
                formData: true,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Book', id }
            ]
        }),
        deleteBook: builder.mutation({
            query: (id) => ({
                url: `/api/books/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'Book', id }
            ]
        }),
        deleteBooks: builder.mutation({
            query: (ids) => ({
                url: `/api/books/delete-multiples?ids=${ids}`,
                method: 'DELETE'
            }),
            invalidatesTags: (result, error) => [
                { type: 'Book', id: "LIST" }
            ]
        }),
        deleteAllBooks: builder.mutation({
            query: () => ({
                url: '/api/books/delete-all',
                method: 'DELETE'
            }),
            invalidatesTags: (result, error) => [
                { type: 'Book', id: "LIST" }
            ]
        }),
    }),
})

export const {
    useGetBookQuery,
    useGetBooksQuery,
    useGetRandomBooksQuery,
    useCreateBookMutation,
    useUpdateBookMutation,
    useDeleteBookMutation,
    useDeleteBooksMutation,
    useDeleteAllBooksMutation,
    usePrefetch: usePrefetchBooks
} = booksApiSlice

export const selectBooksResult = booksApiSlice.endpoints.getBooks.select()

const selectBooksData = createSelector(
    selectBooksResult,
    booksResult => booksResult.data // normalized state object with ids & entities
)

export const {
    selectAll: selectAllBooks,
    selectById: selectBookById,
    selectIds: selectBookIds,
    selectEntities: selectBookEntities
} = booksAdapter.getSelectors(state => selectBooksData(state) ?? initialState)