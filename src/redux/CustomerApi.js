import { baseApi } from "./BaseApi";


export const customerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCustomers: builder.query({
      query: () => ({
        url: "/auth/getAllCustomers",
        method: "GET",
      }),
      providesTags: ["Customers"],
    }),
  }),
});

export const { useGetAllCustomersQuery } = customerApi;
