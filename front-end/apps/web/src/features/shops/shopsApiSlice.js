import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "@ring/redux";

const shopsAdapter = createEntityAdapter({});
const initialState = shopsAdapter.getInitialState({
  page: {
    number: 0,
    size: 0,
    totalElements: 0,
    totalPages: 0,
  },
});

export const shopsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getShop: builder.query({
      query: (id) => ({
        url: `/api/shops/${id}`,
        validateStatus: (response, result) => {
          return response.status === 200 && !result?.isError;
        },
      }),
      providesTags: (result, error, { id }) => [{ type: "Shop", id }],
    }),
    getDisplayShops: builder.query({
      query: (args) => {
        const { page, size, sortBy, sortDir, keyword, followed } = args || {};

        //Params
        const params = new URLSearchParams();
        if (page) params.append("pageNo", page);
        if (size) params.append("pSize", size);
        if (sortBy) params.append("sortBy", sortBy);
        if (sortDir) params.append("sortDir", sortDir);
        if (keyword) params.append("keyword", keyword);
        if (followed) params.append("followed", followed);

        return {
          url: `/api/shops/find?${params.toString()}`,
          validateStatus: (response, result) => {
            return response.status === 200 && !result?.isError;
          },
        };
      },
      transformResponse: (responseData) => {
        const { content, page } = responseData;
        return shopsAdapter.setAll(
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
            { type: "Shop", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Shop", id })),
          ];
        } else return [{ type: "Shop", id: "LIST" }];
      },
    }),
    followShop: builder.mutation({
      query: (id) => ({
        url: `/api/shops/follow/${id}`,
        method: "PUT",
        credentials: "include",
        responseHandler: "text",
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled, getState }) {
        const patchResult = dispatch(
          //Update cache
          shopsApiSlice.util.updateQueryData("getShop", id, (draft) => {
            draft.followed = true;
            draft.totalFollowers++;
          })
        );

        //Get all Shops cache
        const shopsEntries = shopsApiSlice.util.selectInvalidatedBy(
          getState(),
          [{ type: "Shop", id }]
        );

        const shopsPatches = [];

        shopsEntries
          .filter(({ endpointName }) => endpointName === "getDisplayShops") //Filter out other actions except GET
          .forEach(({ originalArgs }) => {
            const patchResult = dispatch(
              //Update
              shopsApiSlice.util.updateQueryData(
                "getDisplayShops",
                originalArgs,
                (draft) => {
                  let updatedShop = {
                    ...draft.entities[id],
                    followed: true,
                    totalFollowers: (draft.entities[id].totalFollowers += 1),
                  };
                  shopsAdapter.upsertOne(draft, updatedShop);
                }
              )
            );

            shopsPatches.push(patchResult);
          });
        try {
          await queryFulfilled;
        } catch (error) {
          //Undo patch if request failed
          patchResult.undo();
          shopsPatches.forEach((patch) => patch.undo());
          console.error(error);
        }
      },
    }),
    unfollowShop: builder.mutation({
      query: (id) => ({
        url: `/api/shops/unfollow/${id}`,
        method: "PUT",
        credentials: "include",
        responseHandler: "text",
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled, getState }) {
        const patchResult = dispatch(
          //Update cache
          shopsApiSlice.util.updateQueryData("getShop", id, (draft) => {
            draft.followed = false;
            draft.totalFollowers--;
          })
        );

        //Get all Shops cache
        const shopsEntries = shopsApiSlice.util.selectInvalidatedBy(
          getState(),
          [{ type: "Shop", id }]
        );

        const shopsPatches = [];

        shopsEntries
          .filter(({ endpointName }) => endpointName === "getDisplayShops") //Filter out other actions except GET
          .forEach(({ originalArgs }) => {
            const patchResult = dispatch(
              //Update
              shopsApiSlice.util.updateQueryData(
                "getDisplayShops",
                originalArgs,
                (draft) => {
                  let updatedShop = {
                    ...draft.entities[id],
                    followed: false,
                    totalFollowers: (draft.entities[id].totalFollowers -= 1),
                  };
                  shopsAdapter.upsertOne(draft, updatedShop);
                }
              )
            );

            shopsPatches.push(patchResult);
          });

        try {
          await queryFulfilled;
        } catch (error) {
          //Undo patch if request failed
          patchResult.undo();
          shopsPatches.forEach((patch) => patch.undo());
          console.error(error);
        }
      },
    }),
  }),
});

export const {
  useGetShopQuery,
  useGetDisplayShopsQuery,
  useFollowShopMutation,
  useUnfollowShopMutation,
  usePrefetch: usePrefetchShops,
} = shopsApiSlice;

export const selectShopsResult =
  shopsApiSlice.endpoints.getDisplayShops.select();

const selectShopsData = createSelector(
  selectShopsResult,
  (shopsResult) => shopsResult.data // normalized state object with ids & entities
);

export const {
  selectAll: selectAllShops,
  selectById: selectShopById,
  selectIds: selectShopIds,
  selectEntities: selectShopEntities,
} = shopsAdapter.getSelectors(
  (state) => selectShopsData(state) ?? initialState
);
