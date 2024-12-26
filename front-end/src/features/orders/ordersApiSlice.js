import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";
import { isEqual } from 'lodash-es';
import { defaultSerializeQueryArgs } from "@reduxjs/toolkit/query";

const ordersAdapter = createEntityAdapter({});
const ordersSelector = ordersAdapter.getSelectors();
const initialState = ordersAdapter.getInitialState({
    page: {
        number: 0,
        size: 0,
        totalElements: 0,
        totalPages: 0,
    },
});

export const ordersApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getReceipt: builder.query({
            query: (id) => ({
                url: `/api/orders/receipts/${id}`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result?.isError
                },
            }),
            providesTags: (result, error, id) => [{ type: 'Receipt', id }]
        }),
        getReceipts: builder.query({
            query: (args) => {
                const { shopId, bookId, page, size, sortBy, sortDir } = args || {};

                //Params
                const params = new URLSearchParams();
                if (shopId) params.append('shopId', shopId);
                if (page) params.append('bookId', bookId);
                if (page) params.append('pageNo', page);
                if (size) params.append('pSize', size);
                if (sortBy) params.append('sortBy', sortBy);
                if (sortDir) params.append('sortDir', sortDir);

                return {
                    url: `/api/orders/receipts?${params.toString()}`,
                    validateStatus: (response, result) => {
                        return response.status === 200 && !result?.isError
                    },
                }
            },
            transformResponse: responseData => {
                const { content, page } = responseData;
                return ordersAdapter.setAll({
                    ...initialState,
                    page
                }, content)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'Receipt', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Receipt', id }))
                    ]
                } else return [{ type: 'Receipt', id: 'LIST' }]
            },
        }),
        getSummaries: builder.query({
            query: (args) => {
                const { shopId, bookId, page, size, sortBy, sortDir } = args || {};

                //Params
                const params = new URLSearchParams();
                if (shopId) params.append('shopId', shopId);
                if (page) params.append('bookId', bookId);
                if (page) params.append('pageNo', page);
                if (size) params.append('pSize', size);
                if (sortBy) params.append('sortBy', sortBy);
                if (sortDir) params.append('sortDir', sortDir);

                return {
                    url: `/api/orders/summaries?${params.toString()}`,
                    validateStatus: (response, result) => {
                        return response.status === 200 && !result?.isError
                    },
                }
            },
            transformResponse: responseData => {
                const { content, page } = responseData;
                return ordersAdapter.setAll({
                    ...initialState,
                    page
                }, content)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'Summary', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Summary', id }))
                    ]
                } else return [{ type: 'Summary', id: 'LIST' }]
            },
        }),
        getOrdersByUser: builder.query({
            query: (args) => {
                const { status, keyword, page, size } = args || {};

                //Params
                const params = new URLSearchParams();
                if (status) params.append('status', status);
                if (keyword) params.append('keyword', keyword);
                if (page) params.append('pageNo', page);
                if (size) params.append('pSize', size);

                return {
                    url: `/api/orders/user?${params.toString()}`,
                    validateStatus: (response, result) => {
                        return response.status === 200 && !result?.isError
                    },
                }
            },
            transformResponse: responseData => {
                const { content, page } = responseData;
                return ordersAdapter.setAll({
                    ...initialState,
                    page
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
                currentCache.page = newItems.page;
                ordersAdapter.upsertMany(
                    currentCache, ordersSelector.selectAll(newItems)
                )
            },
            forceRefetch: ({ currentArg, previousArg }) => {
                const isForceRefetch = (currentArg?.loadMore && !isEqual(currentArg, previousArg) && currentArg?.page > previousArg?.page);
                return isForceRefetch
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'Order', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Order', id }))
                    ]
                } else return [{ type: 'Order', id: 'LIST' }]
            },
        }),
        getOrdersByBookId: builder.query({
            query: (args) => {
                const { id, page, size, sortBy, sortDir } = args || {};

                //Params
                const params = new URLSearchParams();
                if (page) params.append('pageNo', page);
                if (size) params.append('pSize', size);
                if (sortBy) params.append('sortBy', sortBy);
                if (sortDir) params.append('sortDir', sortDir);

                return {
                    url: `/api/orders/book/${id}?${params.toString()}`,
                    validateStatus: (response, result) => {
                        return response.status === 200 && !result?.isError
                    },
                }
            },
            transformResponse: responseData => {
                const { content, page } = responseData;
                return ordersAdapter.setAll({
                    ...initialState,
                    page
                }, content)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'Order', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Order', id }))
                    ]
                } else return [{ type: 'Order', id: 'LIST' }]
            }
        }),
        getSale: builder.query({
            query: () => ({
                url: `/api/orders/sale`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result?.isError
                },
            }),
            providesTags: ['Chart'],
        }),
        calculate: builder.mutation({
            query: (currCart) => ({
                url: '/api/orders/calculate',
                method: 'POST',
                credentials: 'include',
                body: { ...currCart }
            }),
        }),
        checkout: builder.mutation({
            query: ({ token, source, cart }) => ({
                url: '/api/orders',
                method: 'POST',
                credentials: 'include',
                headers: { response: token, source },
                body: { ...cart }
            }),
            invalidatesTags: [
                { type: 'Receipt', id: "LIST" }, { type: 'Order', id: "LIST" }
            ]
        }),
    }),
})

export const {
    useGetReceiptQuery,
    useGetReceiptsQuery,
    useGetSummariesQuery,
    useGetOrdersByUserQuery,
    useGetOrdersByBookIdQuery,
    useGetSaleQuery,
    useCalculateMutation,
    useCheckoutMutation,
} = ordersApiSlice

export const selectReceiptsResult = ordersApiSlice.endpoints.getReceipts.select()

const selectReceiptsData = createSelector(
    selectReceiptsResult,
    receiptsResult => receiptsResult.data // normalized state object with ids & entities
)

export const {
    selectAll: selectAllReceipts,
    selectById: selectReceiptById,
    selectIds: selectReceiptIds,
    selectEntities: selectReceiptEntities
} = ordersAdapter.getSelectors(state => selectReceiptsData(state) ?? initialState)