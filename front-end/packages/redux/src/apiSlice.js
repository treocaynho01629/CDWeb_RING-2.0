import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { clearAuth, setAuth } from "./features/authReducer";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithRefresh = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.meta?.response?.status === 401) {
    //Token expired
    const refreshResult = await baseQuery(
      "/api/auth/refresh-token",
      api,
      extraOptions
    ); //Auto refresh
    const { data, error } = refreshResult;

    if (data) {
      const { token } = data;
      api.dispatch(setAuth(token)); //Re-auth
      result = await baseQuery(args, api, extraOptions); //Refetch
    } else if (error) {
      console.error(error);

      //Logout
      await baseQuery("/api/auth/logout", api, extraOptions);
      api.dispatch(clearAuth());
      api.dispatch(apiSlice.util.resetApiState());

      return refreshResult;
    }
  }

  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithRefresh,
  tagTypes: [
    "Book",
    "User",
    "Profile",
    "Address",
    "Category",
    "Publisher",
    "Shop",
    "Coupon",
    "Review",
    "Order",
    "Banner",
  ],
  endpoints: (builder) => ({}),
});
