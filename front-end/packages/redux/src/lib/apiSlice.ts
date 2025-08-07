import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { clearAuth, setAuth } from "../features/auth/authReducer";
import type {
  FetchArgs,
  BaseQueryApi,
  BaseQueryFn,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
} from "@reduxjs/toolkit/query";
import type { RootState } from "./store";

const baseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError,
  {},
  FetchBaseQueryMeta
> = async (args, api, extraOptions) => {
  // Get base url
  const baseUrl = (api.getState() as RootState).baseUrl;

  // Call fetchBaseQuery with dynamic baseUrl and credentials
  return fetchBaseQuery({
    baseUrl,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  })(args, api, extraOptions);
};

const baseQueryWithRefresh = async (
  args: FetchArgs,
  api: BaseQueryApi,
  extraOptions: {}
) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.meta?.response?.status === 401) {
    //Token expired
    const refreshResult = await baseQuery(
      "/api/auth/refresh-token",
      api,
      extraOptions
    );

    //Auto refresh
    const { data, error } = refreshResult;

    if (data) {
      const { token } = data as { token: string };
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

const apiSlice = createApi({
  baseQuery: baseQueryWithRefresh,
  tagTypes: [],
  endpoints: (builder) => ({}),
});

export default apiSlice;
