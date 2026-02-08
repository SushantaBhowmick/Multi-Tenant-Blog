import { useAuthStore } from "@/store/authStore";
import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

//create axios instance 
export const axiosInstance = axios.create({
    baseURL:API_BASE_URL,
    headers:{
        'Content-Type':'application/json',
    },
    withCredentials:true,
});

//Request interceptor to add access token to headers
axiosInstance.interceptors.request.use((config:InternalAxiosRequestConfig)=>{
    const token = useAuthStore.getState().accessToken;
    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
},(error:AxiosError)=>{
    return Promise.reject(error);
});

//Response interceptor - handle token refresh

let isRefreshing = false;
let failedQueue:any[] = [];

const processQueue = (error:any,token:string | null=null) => {
    failedQueue.forEach((prom)=>{
        if(error){
            prom.reject(error);
        }else{
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

axiosInstance.interceptors.response.use((response)=>response,async(error:AxiosError):Promise<any>=>{
    const originalRequest:any = error.config;
    if(error.response?.status === 401 && !originalRequest._retry){
        if(isRefreshing){
            return new Promise((resolve,reject)=>{
                failedQueue.push({resolve,reject})
            }).then((token)=>{
                if(originalRequest.headers){
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                }
                return axiosInstance(originalRequest);
            }).catch((err)=>Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
            //refresh token
            const {data} = await axios.post(
                `${API_BASE_URL}/auth/refresh-token`,{},{
                    withCredentials:true,
                }
            );
            const newAccessToken = data.data.accessToken;
            useAuthStore.getState().setAccessToken(newAccessToken);

             // Update token in original request
        if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          }
  
          processQueue(null, newAccessToken);
          return axiosInstance(originalRequest);
        } catch (refreshError) {
            processQueue(refreshError, null);
        
            // Refresh failed, logout user
            useAuthStore.getState().logout();
            window.location.href = '/signin';
            
            return Promise.reject(refreshError);
          } finally {
            isRefreshing = false;
          }
    }
    return Promise.reject(error);
});

export default axiosInstance;