import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const catesAdapter = createEntityAdapter({});
const catesSelector = catesAdapter.getSelectors();
const initialState = catesAdapter.getInitialState();

export const categoriesApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getCategories: builder.query({
            query: () => ({
                url: '/api/categories',
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
            }),
            transformResponse: responseData => {
                return catesAdapter.setAll(initialState, responseData)
            },
            serializeQueryArgs: ({ endpointName }) => {
                return endpointName
            },
            merge: (currentCache, newItems) => {
                currentCache.info = newItems.info;
                catesAdapter.addMany(
                    currentCache, catesSelector.selectAll(newItems)
                )
            },
            forceRefetch: ({ currentArg, previousArg }) => {
                const isForceRefetch = (currentArg?.loadMore && (currentArg != previousArg))
                return isForceRefetch
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'Category', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Category', id }))
                    ]
                } else return [{ type: 'Category', id: 'LIST' }]
            }
        }),
    }),
})

export const {
    useGetCategoriesQuery
} = categoriesApiSlice

export const selectCategoriesResult = categoriesApiSlice.endpoints.getCategories.select()

const selectCategoriesData = createSelector(
    selectCategoriesResult,
    catesResult => catesResult.data
)

export const {
    selectAll: selectAllCategory,
    selectById: selectCategoryById,
    selectIds: selectCategoryIds,
    selectEntities: selectCategoryEntities
} = catesAdapter.getSelectors(state => selectCategoriesData(state) ?? initialState)