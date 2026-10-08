import { baseApi } from "./BaseApi";




const AdminApi = baseApi.injectEndpoints({
    endpoints:(builder)=>({
        adminRegister:builder.mutation({
            query:()=>({
                url:"/admin/registerAdmin",
                method:"POST",
            })
        })
    })
})