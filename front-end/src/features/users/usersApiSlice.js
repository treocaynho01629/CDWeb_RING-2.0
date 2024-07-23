import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const usersAdapter = createEntityAdapter({});

const initialState = usersAdapter.getInitialState({
    info: {
        currPage: 0,
        pageSize: 0,
        totalElements: 0,
        totalPages: 0,
    },
});

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getProfile: builder.query({
            query: () => ({
                url: `/api/accounts/profile`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
            }),
            providesTags: (result, error, id) => [{ type: 'User', id }]
        }),
        getUser: builder.query({
            query: ({ id }) => ({
                url: `/api/accounts/${id}`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
            }),
            providesTags: (result, error, id) => [{ type: 'User', id }]
        }),
        getUsers: builder.query({
            query: (args) => {
                const { page, size, sortBy, sortDir } = args || {};

                //Params
                const params = new URLSearchParams();
                if (page) params.append('pageNo', page);
                if (size) params.append('pSize', size);
                if (sortBy) params.append('sortBy', sortBy);
                if (sortDir) params.append('sortDir', sortDir);

                return {
                    url: `/api/accounts?${params.toString()}`,
                    validateStatus: (response, result) => {
                        return response.status === 200 && !result.isError
                    },
                }
            },
            transformResponse: responseData => {
                const { number, size, totalElements, totalPages, content } = responseData;
                return usersAdapter.setAll({
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
                        { type: 'User', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'User', id }))
                    ]
                } else return [{ type: 'User', id: 'LIST' }]
            }
        }),
        getSellers: builder.query({
            query: (args) => {
                const { page, size, sortBy, sortDir } = args || {};

                //Params
                const params = new URLSearchParams();
                if (page) params.append('pageNo', page);
                if (size) params.append('pSize', size);
                if (sortBy) params.append('sortBy', sortBy);
                if (sortDir) params.append('sortDir', sortDir);

                return {
                    url: `/api/accounts/employees?${params.toString()}`,
                    validateStatus: (response, result) => {
                        return response.status === 200 && !result.isError
                    },
                }
            },
            transformResponse: responseData => {
                const { number, size, totalElements, totalPages, content } = responseData;
                return usersAdapter.setAll({
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
                        { type: 'User', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'User', id }))
                    ]
                } else return [{ type: 'User', id: 'LIST' }]
            }
        }),
        createUser: builder.mutation({
            query: newUser => ({
                url: '/api/accounts',
                method: 'POST',
                body: { ...newUser }
            }),
            invalidatesTags: [
                { type: 'User', id: "LIST" }
            ]
        }),
        updateUser: builder.mutation({
            query: ({ id, updatedUser }) => ({
                url: `/api/accounts/${id}`,
                method: 'PUT',
                credentials: 'include',
                body: updatedUser,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'User', id }
            ]
        }),
        deleteUser: builder.mutation({
            query: (id) => ({
                url: `/api/accounts/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'User', id }
            ]
        }),
        deleteUsers: builder.mutation({
            query: (ids) => ({
                url: `/api/accounts/delete-multiples?ids=${ids}`,
                method: 'DELETE'
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'User', id: "LIST" }
            ]
        }),
        deleteAllUsers: builder.mutation({
            query: () => ({
                url: '/api/accounts/delete-all',
                method: 'DELETE'
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'User', id: "LIST" }
            ]
        }),
    }),
})

export const {
    useGetProfileQuery,
    useGetUserQuery,
    useGetUsersQuery,
    useGetSellersQuery,
    useCreateUserMutation,
    useUpdateUserMutation,
    useDeleteUserMutation,
    useDeleteUsersMutation,
    useDeleteAllUsersMutation,
    usePrefetch: usePrefetchUsers
} = usersApiSlice

export const selectUsersResult = usersApiSlice.endpoints.getUsers.select()

const selectUsersData = createSelector(
    selectUsersResult,
    usersResult => usersResult.data
)

export const {
    selectAll: selectAllUsers,
    selectById: selectUserById,
    selectIds: selectUserIds,
    selectEntities: selectUserEntities
} = usersAdapter.getSelectors(state => selectUsersData(state) ?? initialState)