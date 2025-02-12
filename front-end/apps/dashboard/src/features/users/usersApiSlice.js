import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "@ring/redux";

const usersAdapter = createEntityAdapter({});
const initialState = usersAdapter.getInitialState({
  page: {
    number: 0,
    size: 0,
    totalElements: 0,
    totalPages: 0,
  },
});

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUser: builder.query({
      query: (id) => ({
        url: `/api/accounts/${id}`,
        validateStatus: (response, result) => {
          return response.status === 200 && !result?.isError;
        },
      }),
      providesTags: (result, error, id) => [{ type: "User", id }],
    }),
    getUsers: builder.query({
      query: (args) => {
        const { page, size, sortBy, sortDir, keyword, roles } = args || {};

        //Params
        const params = new URLSearchParams();
        if (page) params.append("pageNo", page);
        if (size) params.append("pSize", size);
        if (sortBy) params.append("sortBy", sortBy);
        if (sortDir) params.append("sortDir", sortDir);
        if (keyword) params.append("keyword", keyword);
        if (roles) params.append("roles", roles);

        return {
          url: `/api/accounts?${params.toString()}`,
          validateStatus: (response, result) => {
            return response.status === 200 && !result?.isError;
          },
        };
      },
      transformResponse: (responseData) => {
        const { content, page } = responseData;
        return usersAdapter.setAll(
          {
            ...initialState,
            page,
          },
          content,
        );
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "User", id: "LIST" },
            ...result.ids.map((id) => ({ type: "User", id })),
          ];
        } else return [{ type: "User", id: "LIST" }];
      },
    }),
    getUserAnalytics: builder.query({
      query: () => {
        return {
          url: "/api/accounts/analytics",
          validateStatus: (response, result) => {
            return response.status === 200 && !result?.isError;
          },
        };
      },
      providesTags: [{ type: "User", id: "LIST" }],
    }),
    getTopUsers: builder.query({
      query: () => ({
        url: "/api/accounts/top-accounts",
        validateStatus: (response, result) => {
          return response.status === 200 && !result?.isError;
        },
      }),
      providesTags: [{ type: "User", id: "LIST" }],
    }),
    getTopSellers: builder.query({
      query: () => ({
        url: "/api/accounts/top-sellers",
        validateStatus: (response, result) => {
          return response.status === 200 && !result?.isError;
        },
      }),
      providesTags: [{ type: "User", id: "LIST" }],
    }),
    createUser: builder.mutation({
      query: (newUser) => ({
        url: "/api/accounts",
        method: "POST",
        credentials: "include",
        body: newUser,
        formData: true,
      }),
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),
    updateUser: builder.mutation({
      query: ({ id, updatedUser }) => ({
        url: `/api/accounts/${id}`,
        method: "PUT",
        credentials: "include",
        body: updatedUser,
        formData: true,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "User", id }],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/api/accounts/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: (result, error, id) => [{ type: "User", id }],
    }),
    deleteUsers: builder.mutation({
      query: (ids) => ({
        url: `/api/accounts/delete-multiples?ids=${ids}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: (result, error) => [{ type: "User", id: "LIST" }],
    }),
    deleteAllUsers: builder.mutation({
      query: () => ({
        url: "/api/accounts/delete-all",
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: (result, error) => [{ type: "User", id: "LIST" }],
    }),
  }),
});

export const {
  useGetUserQuery,
  useGetUsersQuery,
  useGetUserAnalyticsQuery,
  useGetTopUsersQuery,
  useGetTopSellersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useDeleteUsersMutation,
  useDeleteAllUsersMutation,
  usePrefetch: usePrefetchUsers,
} = usersApiSlice;

export const selectUsersResult = usersApiSlice.endpoints.getUsers.select();

const selectUsersData = createSelector(
  selectUsersResult,
  (usersResult) => usersResult.data,
);

export const {
  selectAll: selectAllUsers,
  selectById: selectUserById,
  selectIds: selectUserIds,
  selectEntities: selectUserEntities,
} = usersAdapter.getSelectors(
  (state) => selectUsersData(state) ?? initialState,
);
