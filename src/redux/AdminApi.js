import { baseApi } from "./BaseApi";

const AdminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    adminLogin: builder.mutation({
      query: (newData) => ({
        url: "/admin/adminLogin",
        method: "POST",
        body: newData,
      }),
      invalidatesTags: ["Admin"],
    }),

    adminProfile: builder.query({
      query: () => ({
        url: "/admin/getAdminProfile",
        method: "GET",
      }),
      providesTags: ["Admin"],
    }),

    adminLogout: builder.mutation({
      query: () => ({
        url: "/admin/adminLogout",
        method: "POST",
      }),
      invalidatesTags: ["Admin"],
    }),
  }),
});

export const {
  useAdminLoginMutation,
  useAdminProfileQuery,
  useAdminLogoutMutation,
} = AdminApi;
