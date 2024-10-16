import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const couponsAdapter = createEntityAdapter({});
const initialState = couponsAdapter.getInitialState();

export const couponsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getCoupons: builder.query({
            query: (args) => {
                const { type, shop, byShop, page, size, sortBy, sortDir } = args || {};

                //Params
                const params = new URLSearchParams();
                if (type) params.append('type', type);
                if (shop) params.append('shopId', shop);
                if (byShop) params.append('byShop', byShop);
                if (page) params.append('pageNo', page);
                if (size) params.append('pSize', size);
                if (sortBy) params.append('sortBy', sortBy);
                if (sortDir) params.append('sortDir', sortDir);

                return {
                    url: `/api/coupons?${params.toString()}`,
                    validateStatus: (response, result) => {
                        return response.status === 200 && !result.isError
                    },
                }
            },
            transformResponse: responseData => {
                const { number, size, totalElements, totalPages, content } = responseData;
                return couponsAdapter.setAll({
                    ...initialState,
                    info: {
                        currPage: number,
                        pageSize: size,
                        totalElements,
                        totalPages
                    }
                }, content)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'Coupon', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Coupon', id }))
                    ]
                } else return [{ type: 'Coupon', id: 'LIST' }]
            },
        }),
        createCoupon: builder.mutation({
            query: (newCoupon) => ({
                url: `/api/coupons/${id}`,
                method: 'POST',
                credentials: 'include',
                body: newCoupon,
                formData: true,
            }),
            invalidatesTags: [
                { type: 'Coupon', id: "LIST" }
            ]
        }),
        updateCoupon: builder.mutation({
            query: ({ id, updatedCoupon }) => ({
                url: `/api/coupons/${id}`,
                method: 'PUT',
                credentials: 'include',
                body: updatedCoupon,
                formData: true,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Coupon', id }
            ]
        }),
        deleteCoupon: builder.mutation({
            query: (id) => ({
                url: `/api/coupons/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'Coupon', id }
            ]
        }),
        deleteCoupons: builder.mutation({
            query: (arg) => {
                const { type, shop, byShop, ids, isInverse} = args || {};

                //Params
                const params = new URLSearchParams();
                if (type) params.append('type', type);
                if (shop) params.append('shopId', shop);
                if (byShop) params.append('byShop', byShop);
                if (ids) params.append('ids', ids);
                if (isInverse) params.append('isInverse', isInverse);

                return {
                    url: `/api/coupons/delete-multiples?${params.toString()}`,
                    method: 'DELETE',
                }
            },
            invalidatesTags: (result, error) => [
                { type: 'Coupon', id: "LIST" }
            ]
        }),
        deleteAllCoupons: builder.mutation({
            query: () => ({
                url: '/api/coupons/delete-all',
                method: 'DELETE'
            }),
            invalidatesTags: (result, error) => [
                { type: 'Coupon', id: "LIST" }
            ]
        }),
    }),
})

export const {
    useGetCouponsQuery,
    useCreateCouponMutation,
    useUpdateCouponMutation,
    useDeleteCouponMutation,
    useDeleteCouponsMutation,
    useDeleteAllCouponsMutation
} = couponsApiSlice

export const selectCouponsResult = couponsApiSlice.endpoints.getCoupons.select()

const selectCouponsData = createSelector(
    selectCouponsResult,
    couponsResult => couponsResult.data
)

export const {
    selectAll: selectAllCoupon,
    selectById: selectCouponById,
    selectIds: selectCouponIds,
    selectEntities: selectCouponEntities
} = couponsAdapter.getSelectors(state => selectCouponsData(state) ?? initialState)