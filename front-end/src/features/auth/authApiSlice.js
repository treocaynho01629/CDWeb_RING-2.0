import { apiSlice } from "../../app/api/apiSlice";
import { setAuth, clearAuth } from "./authReducer";
import { Cookies } from 'react-cookie';

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        authenticate: builder.mutation({
            query: ({ credentials, persist }) => ({
                url: `/api/auth/authenticate?persist=${persist}`,
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
                } catch (error) {
                    console.error(error);
                }
            }
        }),
        register: builder.mutation({ //FIX
            query: ({ token, user }) => ({
                url: '/api/auth/register',
                method: 'POST',
                headers: { response: token },
                body: {
                    ...user,
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
        signOut: builder.mutation({
            query: () => ({
                url: '/api/auth/logout',
                method: 'DELETE',
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try { //To delete cookie
                    await queryFulfilled;
                    console.log('Logged out');
                } catch (error) {
                    console.error(error);
                } finally { //Clear auth anyway to prevent refresh loop
                    dispatch(clearAuth()); //Reset auth state
                    dispatch(apiSlice.util.resetApiState()); //Reset redux
                }
            }
        }),
    })
})

export const {
    useAuthenticateMutation,
    useSignOutMutation,
    useRegisterMutation,
    useForgotMutation,
    useResetMutation,
    useRefreshMutation,
} = authApiSlice 