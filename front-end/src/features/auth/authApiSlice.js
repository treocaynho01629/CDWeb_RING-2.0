import { apiSlice } from "../../app/api/apiSlice";
import { logOut, setAuth } from "./authSlice";

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
                    const { accessToken } = data
                    dispatch(setAuth({ accessToken }))
                } catch (err) {
                    console.log(err)
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
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled
                    dispatch(logOut()); //Logout redux state
                    setTimeout(() => {
                        dispatch(apiSlice.util.resetApiState()) //Unmount api state
                    }, 1000);
                } catch (err) {
                    console.log(err)
                }
            }
        }),
    })
})

export const {
    useLoginMutation,
    useSignoutMutation,
    useRegisterMutation,
    useRefreshMutation,
} = authApiSlice 