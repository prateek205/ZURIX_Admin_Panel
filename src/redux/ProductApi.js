import { baseApi } from "./BaseApi";

const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllProducts: builder.query({
      query: () => ({
        url: "/products/getAllProducts",
        method: "GET",
      }),
      providesTags: ["Products"],
    }),

    addProduct: builder.mutation({
      query: (newData) => ({
        url: "/products/addProducts",
        method: "POST",
        body: newData,
      }),
      invalidatesTags: ["Products"],
    }),

    getProductId: builder.query({
      query: (id) => ({
        url: `/products/getProductById/${id}`,
        method: "GET",
      }),
      providesTags: ["Products"],
    }),

    updateProduct: builder.mutation({
      query: (id, newData) => ({
        url: `/products/updateProductById/${id}`,
        method: "PUT",
        body: newData,
      }),
      invalidatesTags: ["Products"],
    }),

    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/products/deleteProductById/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products"],
    }),
  }),
});

export const {
  useGetAllProductQuery,
  useAddProductMutation,
  useGetProductIdQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;
