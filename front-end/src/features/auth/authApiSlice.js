import { apiSlice } from "../../app/api/apiSlice";
import { setAuth, logOut } from "./authReducer";

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        authenticate: builder.mutation({
            query: credentials => ({
                url: '/api/auth/authenticate',
                method: 'POST',
                body: { ...credentials }
            })
        }),
        refresh: builder.mutation({
            query: () => ({
                url: '/api/auth/refresh-token',
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
        register: builder.mutation({ //FIX
            query: ({ token, initialUser }) => ({
                url: '/api/auth/register',
                method: 'POST',
                body: {
                    token,
                    request: initialUser,
                }
            }),
            invalidatesTags: [
                { type: 'User', id: "LIST" }
            ]
        }),
        forgot: builder.mutation({
            query: (email) => ({
                url: `/api/auth/forgot-password?email=${email}`,
                method: 'POST',
                responseHandler: "text",
            }),
        }),
        reset: builder.mutation({
            query: resetBody => ({
                url: '/api/auth/reset-password',
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
                url: '/api/auth/logout',
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