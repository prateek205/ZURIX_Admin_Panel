import { baseApi } from "./BaseApi";

const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllOrders: builder.query({
      query: () => ({
        url: "/order/getAllOrders",
        method: "GET",
      }),
      providesTags: ["Orders"],
    }),
  }),
});

export const { useGetAllOrdersQuery } = orderApi;
