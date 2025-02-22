import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "@ring/redux";

const bannersAdapter = createEntityAdapter({});
const initialState = bannersAdapter.getInitialState();

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
        const { content, page } = responseData;
        return bannersAdapter.setAll(
          {
            ...initialState,
            page,
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
    createBanner: builder.mutation({
      query: (newBanner) => ({
        url: `/api/banners/${id}`,
        method: "POST",
        credentials: "include",
        body: newBanner,
        formData: true,
      }),
      invalidatesTags: [{ type: "Banner", id: "LIST" }],
    }),
    updateBanner: builder.mutation({
      query: ({ id, updatedBanner }) => ({
        url: `/api/banners/${id}`,
        method: "PUT",
        credentials: "include",
        body: updatedBanner,
        formData: true,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Banner", id }],
    }),
    deleteBanner: builder.mutation({
      query: (id) => ({
        url: `/api/banners/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Banner", id }],
    }),
    deleteBanners: builder.mutation({
      query: (ids) => ({
        url: `/api/banners/delete-multiples?ids=${ids}`,
        method: "DELETE",
        responseHandler: "text",
      }),
      invalidatesTags: (result, error) => [{ type: "Banner", id: "LIST" }],
    }),
    deleteBannersInverse: builder.mutation({
      query: (args) => {
        const { shop, byShop, ids } = args || {};

        //Params
        const params = new URLSearchParams();
        if (shop) params.append("shopId", shop);
        if (byShop) params.append("byShop", byShop);
        if (ids?.length) params.append("ids", ids);

        return {
          url: `/api/banners/delete-inverse?${params.toString()}`,
          method: "DELETE",
          validateStatus: (response, result) => {
            return response.status === 200 && !result?.isError;
          },
          responseHandler: "text",
        };
      },
      invalidatesTags: (result, error) => [{ type: "Banner", id: "LIST" }],
    }),
    deleteAllBanners: builder.mutation({
      query: (shopId) => ({
        url: `/api/banners/delete-all?shopId=${shopId}`,
        method: "DELETE",
        responseHandler: "text",
      }),
      invalidatesTags: (result, error) => [{ type: "Banner", id: "LIST" }],
    }),
  }),
});

export const {
  useGetBannersQuery,
  useCreateBannerMutation,
  useUpdateBannerMutation,
  useDeleteBannerMutation,
  useDeleteBannersMutation,
  useDeleteBannersInverseMutation,
  useDeleteAllBannersMutation,
} = bannersApiSlice;

export const selectBannersResult =
  bannersApiSlice.endpoints.getBanners.select();

const selectBannersData = createSelector(
  selectBannersResult,
  (bannersResult) => bannersResult.data
);

export const {
  selectAll: selectAllBanner,
  selectById: selectBannerById,
  selectIds: selectBannerIds,
  selectEntities: selectBannerEntities,
} = bannersAdapter.getSelectors(
  (state) => selectBannersData(state) ?? initialState
);
