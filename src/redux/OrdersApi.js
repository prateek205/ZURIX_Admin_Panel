import { baseApi } from "./BaseApi";

const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllOrders: builder.query({
      query: () => ({
        url: "/order/get-Orders",
        method: "GET",
      }),
      providesTags: ["Orders"],
    }),
  }),
});

export const { useGetAllOrdersQuery } = orderApi;
