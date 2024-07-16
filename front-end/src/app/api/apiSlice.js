import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { setAuth } from '../../features/auth/authSlice';

const baseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_PORT_SOCKET_SPRING,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.token
        if (token) headers.set("Authorization", `Bearer ${token}`);
        return headers
    }
})

const baseQueryWithRefresh = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions)

    if (result?.error?.status === 403) {
        console.log("Refreshing token");
        const refreshData = await baseQuery("/api/v1/auth/refresh-token", api, extraOptions)

        if (refreshData?.data) {
            api.dispatch(setAuth({ ...refreshData.data })) //Re-auth
            result = await baseQuery(args, api, extraOptions) //Refetch
        } else {
            if (refreshData?.error?.status === 403) {
                refreshData.error.data.message = "Your token has expired."
            }
            return refreshData
        }
    }

    return result
}

export const apiSlice = createApi({
    baseQuery: baseQueryWithRefresh,
    tagTypes: ['Book', 'User', 'Category', 'Publisher', 'Review', 'Image'],
    endpoints: builder => ({})
})