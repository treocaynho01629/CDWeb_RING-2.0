import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const pubsAdapter = createEntityAdapter({});
const pubsSelector = pubsAdapter.getSelectors();
const initialState = pubsAdapter.getInitialState();

export const publishersApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getPublishers: builder.query({
            query: () => ({
                url: '/api/publishers',
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
            }),
            transformResponse: responseData => {
                return pubsAdapter.setAll(initialState, responseData)
            },
            serializeQueryArgs: ({ endpointName }) => {
                return endpointName
            },
            merge: (currentCache, newItems) => {
                currentCache.info = newItems.info;
                pubsAdapter.addMany(
                    currentCache, pubsSelector.selectAll(newItems)
                )
            },
            forceRefetch: ({ currentArg, previousArg }) => {
                const isForceRefetch = (currentArg?.loadMore && (currentArg != previousArg))
                return isForceRefetch
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'Publisher', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Publisher', id }))
                    ]
                } else return [{ type: 'Publisher', id: 'LIST' }]
            }
        }),
    }),
})

export const {
    useGetPublishersQuery
} = publishersApiSlice

export const selectPublishersResult = publishersApiSlice.endpoints.getPublishers.select()

const selectPublishersData = createSelector(
    selectPublishersResult,
    pubsResult => pubsResult.data
)

export const {
    selectAll: selectAllPublisher,
    selectById: selectPublisherById,
    selectIds: selectPublisherIds,
    selectEntities: selectPublisherEntities
} = pubsAdapter.getSelectors(state => selectPublishersData(state) ?? initialState)