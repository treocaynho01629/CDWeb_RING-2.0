import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";
import { isEqual } from 'lodash-es';

const ordersAdapter = createEntityAdapter({});
const ordersSelector = ordersAdapter.getSelectors();
const initialState = ordersAdapter.getInitialState({
    info: {
        currPage: 0,
        pageSize: 0,
        totalElements: 0,
        totalPages: 0,
    },
});

export const ordersApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getOrder: builder.query({
            query: (id) => ({
                url: `/api/orders/${id}`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
            }),
            providesTags: (result, error, id) => [{ type: 'Order', id }]
        }),
        getOrders: builder.query({
            query: (args) => {
                const { page, size, sortBy, sortDir } = args || {};

                //Params
                const params = new URLSearchParams();
                if (page) params.append('pageNo', page);
                if (size) params.append('pSize', size);
                if (sortBy) params.append('sortBy', sortBy);
                if (sortDir) params.append('sortDir', sortDir);

                return {
                    url: `/api/orders?${params.toString()}`,
                    validateStatus: (response, result) => {
                        return response.status === 200 && !result.isError
                    },
                }
            },
            transformResponse: responseData => {
                const { number, size, totalElements, totalPages, content } = responseData;
                return ordersAdapter.setAll({
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
                        { type: 'Order', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Order', id }))
                    ]
                } else return [{ type: 'Order', id: 'LIST' }]
            },
        }),
        getOrdersByUser: builder.query({
            query: (args) => {
                const { page, size } = args || {};

                //Params
                const params = new URLSearchParams();
                if (page) params.append('pageNo', page);
                if (size) params.append('pSize', size);

                return {
                    url: `/api/orders/user?${params.toString()}`,
                    validateStatus: (response, result) => {
                        return response.status === 200 && !result.isError
                    },
                }
            },
            transformResponse: responseData => {
                const { number, size, totalElements, totalPages, content } = responseData;
                return ordersAdapter.setAll({
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
                ordersAdapter.upsertMany(
                    currentCache, ordersSelector.selectAll(newItems)
                )
            },
            forceRefetch: ({ currentArg, previousArg }) => {
                const isForceRefetch = (currentArg?.loadMore && !isEqual(currentArg, previousArg))
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
                        return response.status === 200 && !result.isError
                    },
                }
            },
            transformResponse: responseData => {
                const { number, size, totalElements, totalPages, content } = responseData;
                return ordersAdapter.setAll({
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
                    return response.status === 200 && !result.isError
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
            query: (newOrder) => ({
                url: '/api/orders',
                method: 'POST',
                credentials: 'include',
                body: { ...newOrder }
            }),
            invalidatesTags: [
                { type: 'Order', id: "LIST" }
            ]
        }),
    }),
})

export const {
    useGetOrderQuery,
    useGetOrdersQuery,
    useGetOrdersByUserQuery,
    useGetOrdersByBookIdQuery,
    useGetSaleQuery,
    useCalculateMutation,
    useCheckoutMutation,
} = ordersApiSlice

export const selectOrdersResult = ordersApiSlice.endpoints.getOrders.select()

const selectOrdersData = createSelector(
    selectOrdersResult,
    ordersResult => ordersResult.data // normalized state object with ids & entities
)

export const {
    selectAll: selectAllOrders,
    selectById: selectOrderById,
    selectIds: selectOrderIds,
    selectEntities: selectOrderEntities
} = ordersAdapter.getSelectors(state => selectOrdersData(state) ?? initialState)