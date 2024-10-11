import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const catesAdapter = createEntityAdapter({});
const catesSelector = catesAdapter.getSelectors();
const initialState = catesAdapter.getInitialState({
    info: {
        currPage: 0,
        pageSize: 0,
        totalElements: 0,
        totalPages: 0,
    },
});

export const categoriesApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getAllCategories: builder.query({
            query: () => ({
                url: '/api/categories/all',
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
            }),
            transformResponse: responseData => {
                return catesAdapter.setAll(initialState, responseData)
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
        getPreviewCategories: builder.query({
            query: () => ({
                url: '/api/categories/preview',
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
            }),
            transformResponse: responseData => {
                return catesAdapter.setAll(initialState, responseData)
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
        getCategories: builder.query({
            query: (args) => {
                const { page, size } = args || {};

                //Params
                const params = new URLSearchParams();
                if (page) params.append('pageNo', page);
                if (size) params.append('pSize', size);

                return {
                    url: `/api/categories?${params.toString()}`,
                    validateStatus: (response, result) => {
                        return response.status === 200 && !result.isError
                    },
                }
            },
            transformResponse: responseData => {
                const { number, size, totalElements, totalPages, content } = responseData;
                return catesAdapter.setAll({
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
        createCategory: builder.mutation({
            query: ({ id, newCategory }) => ({
                url: `/api/categories/${id}`,
                method: 'POST',
                credentials: 'include',
                body: { ...newCategory }
            }),
            invalidatesTags: [
                { type: 'Category', id: "LIST" }
            ]
        }),
        updateCategory: builder.mutation({
            query: ({ id, updateCategory }) => ({
                url: `/api/categories/${id}`,
                method: 'PUT',
                credentials: 'include',
                body: updateCategory,
                formData: true,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Category', id }
            ]
        }),
        deleteCategory: builder.mutation({
            query: (id) => ({
                url: `/api/categories/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'Category', id }
            ]
        }),
        deleteCategories: builder.mutation({
            query: (ids) => ({
                url: `/api/categories/delete-multiples?ids=${ids}`,
                method: 'DELETE'
            }),
            invalidatesTags: (result, error) => [
                { type: 'Category', id: "LIST" }
            ]
        }),
        deleteAllCategories: builder.mutation({
            query: () => ({
                url: '/api/categories/delete-all',
                method: 'DELETE'
            }),
            invalidatesTags: (result, error) => [
                { type: 'Category', id: "LIST" }
            ]
        }),
    }),
})

export const {
    useGetAllCategoriesQuery,
    useGetPreviewCategoriesQuery,
    useGetCategoriesQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
    useDeleteCategoriesMutation,
    useDeleteAllCategoriesMutation
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