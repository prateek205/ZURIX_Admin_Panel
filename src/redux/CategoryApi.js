import { baseApi } from "./BaseApi";

const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCategory: builder.query({
      query: () => ({
        url: "/category/getAllCategory",
        method: "GET",
      }),
      providesTags: ["Category"],
    }),
  }),
});

export const { useGetAllCategoryQuery } = categoryApi;
