import type { AuthResponse, LoginInput, RefreshTokenResponse, RegisterInput, User } from "@/types/authTypes";
import axiosInstance from "./axiosInstance";
import type { ApiResponse } from "@/types/apiTypes";


export const authApi ={

    // register user
    register:async(data:RegisterInput):Promise<AuthResponse>=>{
        const response = await axiosInstance.post('/auth/register',data)
        return response.data;
    },

    // login
    login:async(data:LoginInput):Promise<AuthResponse>=>{
        const response = await axiosInstance.post('/auth/login',data)
        return response.data;
    },
    // Logout
    logout:async():Promise<void>=>{
        await axiosInstance.post('/auth/logout',{},{
            withCredentials:true,
        })
    },
    // Logout
    logoutAllDevices:async():Promise<void>=>{
        await axiosInstance.post('/auth/logout-all-devices',{},{
            withCredentials:true,
        })
    },
    // get Current User
    getCurrentUser:async():Promise<ApiResponse<User>>=>{
        const response = await axiosInstance.get('/auth/me',{
            withCredentials:true,
        })
        return response.data;
    },
    // get Current User
    refreshToken:async():Promise<Promise<RefreshTokenResponse>>=>{
        const response = await axiosInstance.post('/auth/refresh-token',{
            withCredentials:true,
        })
        return response.data;
    },

}