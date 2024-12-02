import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { logOut, setAuth } from '../../features/auth/authReducer';

const baseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_PORT_SOCKET_SPRING,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.token;
        if (token) headers.set("Authorization", `Bearer ${token}`);
        return headers
    }
})

const baseQueryWithRefresh = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions)

    if (result?.meta?.response?.status === 401) { //Token expired
        const { data } = await baseQuery("/api/auth/refresh-token", api, extraOptions); //Refresh
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
    tagTypes: ['Book', 'User', 'Profile', 'Address', 'Category', 'Publisher', 'Shop', 'Coupon', 'Review', 'Receipt', 'Order', 'Banner', 'Chart'],
    endpoints: builder => ({})
})