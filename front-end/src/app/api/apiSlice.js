import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { logOut, setAuth } from '../../features/auth/authSlice';
import { Cookies } from 'react-cookie';

const cookies = new Cookies();
const getCookieValue = (cookieName) => {
    let result = cookies.get(cookieName);
    console.log(result);
    if (result.path) return null;
    return result;
};

const baseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_PORT_SOCKET_SPRING,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.token;
        const refreshToken = getCookieValue('refreshToken');
        console.log(refreshToken)
        if (token) {
            headers.set("Authorization", `Bearer ${token}`)
        } else if (refreshToken) {
            headers.set("Authorization", `Bearer ${refreshToken}`)
        }
        return headers
    }
})

//Only for refresh during expiration
const baseQueryForRefresh = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_PORT_SOCKET_SPRING,
    credentials: "include",
    prepareHeaders: (headers) => {
        const refreshToken = getCookieValue('refreshToken');
        if (refreshToken) headers.set("Authorization", `Bearer ${refreshToken}`);
        return headers
    }
})

const baseQueryWithRefresh = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions)

    if (result?.error?.status === 403) {
        const { data } = await baseQueryForRefresh("/api/v1/auth/refresh-token", api, extraOptions)
        const { token } = data;

        if (token) {
            api.dispatch(setAuth({ token })) //Re-auth
            result = await baseQuery(args, api, extraOptions) //Refetch
        } else {
            if (refreshData?.error?.status === 401) {
                refreshData.error.data.message = "Your token has expired."
            }
            api.dispatch(logOut());
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