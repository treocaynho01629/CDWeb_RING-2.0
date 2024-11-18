import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const shopsAdapter = createEntityAdapter({});
const initialState = shopsAdapter.getInitialState({
    info: {
        currPage: 0,
        pageSize: 0,
        totalElements: 0,
        totalPages: 0,
    },
});

export const shopsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getShop: builder.query({
            query: (id) => ({
                url: `/api/shops/${id}`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
            }),
            providesTags: (result, error, { id }) => [
                { type: 'Shop', id }
            ]
        }),
        getShops: builder.query({
            query: (args) => {
                const { page, size, sortBy, sortDir } = args || {};

                //Params
                const params = new URLSearchParams();
                if (page) params.append('pageNo', page);
                if (size) params.append('pSize', size);
                if (sortBy) params.append('sortBy', sortBy);
                if (sortDir) params.append('sortDir', sortDir);

                return {
                    url: `/api/shops?${params.toString()}`,
                    validateStatus: (response, result) => {
                        return response.status === 200 && !result.isError
                    },
                }
            },
            transformResponse: responseData => {
                const { number, size, totalElements, totalPages, content } = responseData;
                return shopsAdapter.setAll({
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
                        { type: 'Shop', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Shop', id }))
                    ]
                } else return [{ type: 'Shop', id: 'LIST' }]
            },
        }),
        followShop: builder.mutation({
            query: (id) => ({
                url: `/api/shops/follow/${id}`,
                method: 'PUT',
                credentials: 'include',
                responseHandler: (response) => response.text(),
            }),
            async onQueryStarted(id, { dispatch, queryFulfilled }) {
                const patchResult = dispatch( //Update cache
                    shopsApiSlice.util.updateQueryData('getShop', id, (draft) => {
                        draft.followed = true;
                        draft.totalFollowers++;
                    })
                )
                try {
                    await queryFulfilled;
                } catch (error) { //Undo patch if request failed
                    patchResult.undo();
                    console.error(error);
                }
            }
        }),
        unfollowShop: builder.mutation({
            query: (id) => ({
                url: `/api/shops/unfollow/${id}`,
                method: 'PUT',
                credentials: 'include',
                responseHandler: (response) => response.text(),
            }),
            async onQueryStarted(id, { dispatch, queryFulfilled }) {
                const patchResult = dispatch( //Update cache
                    shopsApiSlice.util.updateQueryData('getShop', id, (draft) => {
                        draft.followed = false;
                        draft.totalFollowers--;
                    })
                )
                try {
                    await queryFulfilled;
                } catch (error) { //Undo patch if request failed
                    patchResult.undo();
                    console.error(error);
                }
            }
        }),
        createShop: builder.mutation({
            query: (newShop) => ({
                url: '/api/shops',
                method: 'POST',
                credentials: 'include',
                body: newShop,
                formData: true,
            }),
            invalidatesTags: [
                { type: 'Shop', id: "LIST" }
            ]
        }),
        updateShop: builder.mutation({
            query: ({ id, updatedShop }) => ({
                url: `/api/shops/${id}`,
                method: 'PUT',
                credentials: 'include',
                body: updatedShop,
                formData: true,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Shop', id }
            ]
        }),
        deleteShop: builder.mutation({
            query: (id) => ({
                url: `/api/shops/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'Shop', id }
            ]
        }),
        deleteShops: builder.mutation({
            query: (ids) => ({
                url: `/api/shops/delete-multiples?ids=${ids}`,
                method: 'DELETE'
            }),
            invalidatesTags: (result, error) => [
                { type: 'Shop', id: "LIST" }
            ]
        }),
        deleteAllShops: builder.mutation({
            query: () => ({
                url: '/api/shops/delete-all',
                method: 'DELETE'
            }),
            invalidatesTags: (result, error) => [
                { type: 'Shop', id: "LIST" }
            ]
        }),
    }),
})

export const {
    useGetShopQuery,
    useGetShopsQuery,
    useFollowShopMutation,
    useUnfollowShopMutation,
    useCreateShopMutation,
    useUpdateShopMutation,
    useDeleteShopMutation,
    useDeleteShopsMutation,
    useDeleteAllShopsMutation,
    usePrefetch: usePrefetchShops
} = shopsApiSlice

export const selectShopsResult = shopsApiSlice.endpoints.getShops.select()

const selectShopsData = createSelector(
    selectShopsResult,
    shopsResult => shopsResult.data // normalized state object with ids & entities
)

export const {
    selectAll: selectAllShops,
    selectById: selectShopById,
    selectIds: selectShopIds,
    selectEntities: selectShopEntities
} = shopsAdapter.getSelectors(state => selectShopsData(state) ?? initialState)