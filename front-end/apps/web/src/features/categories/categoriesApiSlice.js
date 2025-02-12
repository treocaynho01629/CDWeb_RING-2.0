import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "@ring/redux";
import { defaultSerializeQueryArgs } from "@reduxjs/toolkit/query";
import { isEqual } from "lodash-es";

const catesAdapter = createEntityAdapter({});
const catesSelector = catesAdapter.getSelectors();
const initialState = catesAdapter.getInitialState({
  page: {
    number: 0,
    size: 0,
    totalElements: 0,
    totalPages: 0,
  },
});

export const categoriesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCategory: builder.query({
      query: ({ id, slug, include }) => ({
        url: `/api/categories/${slug ? "slug/" + slug : id ? id : ""}${include ? `?include=${include}` : ""}`,
        validateStatus: (response, result) => {
          return response.status === 200 && !result?.isError;
        },
      }),
      providesTags: (result, error) => [{ type: "Category", id: result.id }],
    }),
    getPreviewCategories: builder.query({
      query: () => ({
        url: "/api/categories/preview",
        validateStatus: (response, result) => {
          return response.status === 200 && !result?.isError;
        },
      }),
      transformResponse: (responseData) => {
        return catesAdapter.setAll(initialState, responseData ?? {});
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "Category", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Category", id })),
          ];
        } else return [{ type: "Category", id: "LIST" }];
      },
    }),
    getCategories: builder.query({
      query: (args) => {
        const { page, size, sortBy, sortDir, include, parentId } = args || {};

        //Params
        const params = new URLSearchParams();
        if (page) params.append("pageNo", page);
        if (size) params.append("pSize", size);
        if (sortBy) params.append("sortBy", sortBy);
        if (sortDir) params.append("sortDir", sortDir);
        if (include) params.append("include", include);
        if (parentId) params.append("parentId", parentId);

        return {
          url: `/api/categories?${params.toString()}`,
          validateStatus: (response, result) => {
            return response.status === 200 && !result?.isError;
          },
        };
      },
      transformResponse: (responseData) => {
        const { content, page } = responseData;
        return catesAdapter.setAll(
          {
            ...initialState,
            page,
          },
          content,
        );
      },
      serializeQueryArgs: ({ endpointName, queryArgs, endpointDefinition }) => {
        if (queryArgs) {
          const { loadMore, ...mainQuery } = queryArgs;

          if (loadMore) {
            //Load more >> serialize without <pagination>
            const { page, size, ...rest } = mainQuery;
            if (JSON.stringify(rest) === "{}") return endpointName + "Merge";
            return defaultSerializeQueryArgs({
              endpointName: endpointName + "Merge",
              queryArgs: rest,
              endpointDefinition,
            });
          }

          //Serialize like normal
          if (JSON.stringify(mainQuery) === "{}") return endpointName;
          return defaultSerializeQueryArgs({
            endpointName,
            queryArgs: mainQuery,
            endpointDefinition,
          });
        } else {
          return endpointName;
        }
      },
      merge: (currentCache, newItems) => {
        currentCache.page = newItems.page;
        catesAdapter.addMany(currentCache, catesSelector.selectAll(newItems));
      },
      forceRefetch: ({ currentArg, previousArg }) => {
        const isForceRefetch =
          currentArg?.loadMore &&
          !isEqual(currentArg, previousArg) &&
          currentArg?.page > previousArg?.page;
        return isForceRefetch;
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "Category", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Category", id })),
          ];
        } else return [{ type: "Category", id: "LIST" }];
      },
    }),
  }),
});

export const {
  useGetCategoryQuery,
  useGetPreviewCategoriesQuery,
  useGetCategoriesQuery,
} = categoriesApiSlice;

export const selectCategoriesResult =
  categoriesApiSlice.endpoints.getCategories.select();

const selectCategoriesData = createSelector(
  selectCategoriesResult,
  (catesResult) => catesResult.data,
);

export const {
  selectAll: selectAllCategory,
  selectById: selectCategoryById,
  selectIds: selectCategoryIds,
  selectEntities: selectCategoryEntities,
} = catesAdapter.getSelectors(
  (state) => selectCategoriesData(state) ?? initialState,
);
