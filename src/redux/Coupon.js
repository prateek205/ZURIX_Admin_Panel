import { baseApi } from "./BaseApi";

const couponApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCoupons: builder.query({
      query: () => ({
        url: "/coupen/getAllCoupen",
        method: "GET",
      }),
      providesTags: ["Coupon"],
    }),

    addCoupons: builder.mutation({
      query: (newData) => ({
        url: "/coupen/createCoupen",
        method: "POST",
        body: newData,
      }),
      invalidatesTags: ["Coupon"],
    }),
  }),
});

export const { useGetAllCouponsQuery, useAddCouponsMutation } = couponApi;
