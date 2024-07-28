import { apiSlice } from "../../app/api/apiSlice";
import { setAuth, logOut } from "./authSlice";

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
                    const { data } = await queryFulfilled;
                    const { token } = data;
                    if (token) dispatch(setAuth({ token })) //Reauth
                } catch (err) {
                    dispatch(logOut());
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
        forgot: builder.mutation({
            query: (email) => ({
                url: `/api/v1/auth/forgot-password?email=${email}`,
                method: 'POST',
                responseHandler: "text",
            }),
        }),
        reset: builder.mutation({
            query: resetBody => ({
                url: '/api/v1/auth/reset-password',
                method: 'PUT',
                body: {
                    ...resetBody,
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
    useForgotMutation,
    useResetMutation,
    useRefreshMutation,
} = authApiSlice 