import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { logOut, setAuth } from '../../features/auth/authReducer';
import { Cookies } from 'react-cookie';

const cookies = new Cookies();
const getCookieValue = (cookieName) => {
    let result = cookies.get(cookieName);
    if (result?.path) return null;
    return result;
};

const baseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_PORT_SOCKET_SPRING,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.token;
        const persist = getState().auth.persist;
        const refreshToken = getCookieValue('refreshToken');
        if (token) {
            headers.set("Authorization", `Bearer ${token}`)
        } else if (persist && refreshToken) {
            headers.set("Authorization", `Bearer ${refreshToken}`)
        }
        return headers
    }
})

//Only for refresh during expiration
const baseQueryForRefresh = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_PORT_SOCKET_SPRING,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
        const persist = getState().auth.persist;
        const refreshToken = getCookieValue('refreshToken');
        if (persist && refreshToken) headers.set("Authorization", `Bearer ${refreshToken}`);
        return headers
    }
})

const baseQueryWithRefresh = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions)

    if (result?.meta?.response?.status === 401 || result?.meta?.response?.status === 403) {
        const { data } = await baseQueryForRefresh("/api/v1/auth/refresh-token", api, extraOptions)
        const { token, code, errors } = data;

        if (token) {
            api.dispatch(setAuth({ token })) //Re-auth
            result = await baseQuery(args, api, extraOptions) //Refetch
        } else {
            if (code === 500) console.error(errors?.errorMessage ?? 'Your token is not valid');
            api.dispatch(logOut());
            return data;
        }
    }

    return result
}

export const apiSlice = createApi({
    baseQuery: baseQueryWithRefresh,
    tagTypes: ['Book', 'User', 'Profile', 'Category', 'Publisher', 'Review', 'Order', 'Chart'],
    endpoints: builder => ({})
})