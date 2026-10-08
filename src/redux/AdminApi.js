import { baseApi } from "./BaseApi";

const AdminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    adminLogin: builder.mutation({
      query: (newData) => ({
        url: "/admin/loginAdmin",
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
        url: "/admin/logoutAdmin",
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
