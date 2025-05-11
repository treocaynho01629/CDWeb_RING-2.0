import { createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "@ring/redux";

export const bannersAdapter = createEntityAdapter({});
export const bannersInitialState = bannersAdapter.getInitialState({
  empty: false,
  page: 0,
  size: 0,
  totalElements: 0,
  totalPages: 0,
});

export const bannersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBanners: builder.query({
      query: (args) => {
        const { shop, byShop, page, size, sortBy, sortDir } = args || {};

        //Params
        const params = new URLSearchParams();
        if (shop) params.append("shopId", shop);
        if (byShop) params.append("byShop", byShop);
        if (page) params.append("pageNo", page);
        if (size) params.append("pSize", size);
        if (sortBy) params.append("sortBy", sortBy);
        if (sortDir) params.append("sortDir", sortDir);

        return {
          url: `/api/banners?${params.toString()}`,
          validateStatus: (response, result) => {
            return response.status === 200 && !result?.isError;
          },
        };
      },
      transformResponse: (responseData) => {
        const { content, empty, page, size, totalElements, totalPages } =
          responseData;
        return bannersAdapter.setAll(
          {
            ...bannersInitialState,
            empty,
            page,
            size,
            totalElements,
            totalPages,
          },
          content
        );
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "Banner", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Banner", id })),
          ];
        } else return [{ type: "Banner", id: "LIST" }];
      },
    }),
  }),
});
