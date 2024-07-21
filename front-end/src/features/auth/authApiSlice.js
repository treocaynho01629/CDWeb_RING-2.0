import { apiSlice } from "../../app/api/apiSlice";
import { setAuth } from "./authSlice";

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        authenticate: builder.mutation({
            query: credentials => ({
                url: '/api/v1/auth/authenticate',
                method: 'POST',
                body: { ...credentials }
            })
        }),
        refresh: builder.mutation({
            query: () => ({
                url: '/api/v1/auth/refresh-token',
                method: 'GET',
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try { //Set new auth token after refresh
                    const { data } = await queryFulfilled
                    const { token } = data
                    dispatch(setAuth({ token }))
                } catch (err) {
                    console.error(err)
                }
            }
        }),
        register: builder.mutation({
            query: initialUser => ({
                url: '/api/v1/auth/register',
                method: 'POST',
                body: {
                    ...initialUser,
                }
            }),
            invalidatesTags: [
                { type: 'User', id: "LIST" }
            ]
        }),
        signout: builder.mutation({
            query: () => ({
                url: '/api/v1/auth/logout',
                method: 'DELETE',
            }),
        }),
    })
})

export const {
    useAuthenticateMutation,
    useSignoutMutation,
    useRegisterMutation,
    useRefreshMutation,
} = authApiSlice 