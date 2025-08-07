import {
  createEntityAdapter,
  EntityId,
  createDraftSafeSelector,
  EntityState,
} from "@reduxjs/toolkit";
import { RootState } from "../../lib/store";
import apiSlice from "../../lib/apiSlice";

export interface EnumResponse {
  name: string;
  value: any;
}
export type EnumsReponse = EnumResponse[];

const enumsAdapter = createEntityAdapter<EnumResponse, EntityId>({
  selectId: (item: EnumResponse) => item.name,
});
const initialState = enumsAdapter.getInitialState();
const apiWithEnum = apiSlice.enhanceEndpoints({ addTagTypes: ["Enum"] });

export const enumsApiSlice = apiWithEnum.injectEndpoints({
  endpoints: (builder) => ({
    getEnums: builder.query<EntityState<EnumResponse, EntityId>, void>({
      query: () => ({
        url: "/api/v1/enums",
        validateStatus: (response, result) => {
          return response.status === 200 && !result?.isError;
        },
      }),
      transformResponse: (response: EnumsReponse) => {
        const loadedEnums: Record<string, EnumResponse> = response.reduce(
          (acc: Record<string, EnumResponse>, item: EnumResponse) => {
            acc[item.name] = item;
            return acc;
          },
          {}
        );
        return enumsAdapter.setAll(initialState, loadedEnums);
      },
      providesTags: (result) =>
        result
          ? [
              ...result.ids.map((id) => ({ type: "Enum" as const, id })),
              { type: "Enum", id: "LIST" },
            ]
          : [{ type: "Enum", id: "LIST" }],
    }),
  }),
});

export const { useGetEnumsQuery } = enumsApiSlice;

export const selectEnumsResult = enumsApiSlice.endpoints.getEnums.select();

const selectEnumsData = createDraftSafeSelector(
  selectEnumsResult,
  (enumsResult) => enumsResult.data
);

export const {
  selectAll: selectAllEnum,
  selectById: selectEnumById,
  selectIds: selectEnumIds,
  selectEntities: selectEnumEntities,
} = enumsAdapter.getSelectors<RootState>(
  (state) => selectEnumsData(state) ?? initialState
);
