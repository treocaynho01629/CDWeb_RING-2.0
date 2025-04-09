import { couponsApiSlice as initialsApiSlice } from "@ring/redux";

export const couponsApiSlice = initialsApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCoupon: builder.query({
      query: (args) => {
        const { code, cValue, cQuantity } = args || {};

        //Params
        const params = new URLSearchParams();
        if (cValue) params.append("cValue", cValue);
        if (cQuantity) params.append("cQuantity", cQuantity);

        return {
          url: `/api/coupons/code/${code}?${params.toString()}`,
          validateStatus: (response, result) => {
            return response.status === 200 && !result?.isError;
          },
        };
      },
      providesTags: (result, error) => [
        result ? { type: "Coupon", id: result.id } : { type: "Coupon" },
      ],
    }),
    getRecommendCoupons: builder.query({
      query: (args) => {
        const { shopIds } = args || {};

        //Params
        const params = new URLSearchParams();
        if (shopIds) params.append("shopIds", shopIds);

        return {
          url: `/api/coupons/recommend?${params.toString()}`,
          validateStatus: (response, result) => {
            return response.status === 200 && !result?.isError;
          },
        };
      },
      transformResponse: (responseData) => {
        return couponsAdapter.setAll(initialState, responseData ?? {});
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "Coupon", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Coupon", id })),
          ];
        } else return [{ type: "Coupon", id: "LIST" }];
      },
    }),
  }),
});

export const {
  useGetCouponQuery,
  useGetCouponsQuery,
  useGetRecommendCouponsQuery,
} = couponsApiSlice;
