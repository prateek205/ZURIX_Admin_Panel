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

    addCategory: builder.mutation({
      query: (newData) => ({
        url: "/category/createCategory",
        method: "POST",
        body: newData,
      }),
      invalidatesTags: ["Category"],
    }),
  }),
});

export const { useGetAllCategoryQuery, useAddCategoryMutation } = categoryApi;
