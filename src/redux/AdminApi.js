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

    adminForgotPassword: builder.mutation({
      query: (data) => ({
        url: "/admin/forgot-password",
        method: "POST",
        body: data,
      }),
    }),

    adminResetPassword: builder.mutation({
      query: (data) => ({
        url: "/admin/reset-password",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useAdminLoginMutation,
  useAdminProfileQuery,
  useAdminLogoutMutation,
  useAdminForgotPasswordMutation,
  useAdminResetPasswordMutation,
} = AdminApi;
