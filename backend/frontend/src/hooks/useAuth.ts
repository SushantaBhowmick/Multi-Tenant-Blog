import {useNavigate} from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/store/authStore';
import { authApi } from '@/api/authApi';
import { toast } from 'sonner';
import type { AxiosError } from 'axios';
import type { ApiError } from '@/types/apiTypes';

export const useAuth =()=>{
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const {setAuth,logout,user,isAuthenticated} = useAuthStore();

    //Register mutation
    const registerMutation = useMutation({
        mutationFn:authApi.register,
        onSuccess:(data)=>{
            setAuth(data.data.user,data.data.accessToken);
            toast.success(data.message || 'User registered successfully');
            navigate('/dashboard');
        },
        onError:(error)=>{
            toast.error((error as AxiosError<ApiError>).response?.data?.message || 'Something went wrong');
        }
    });


  // Login mutation
  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setAuth(data.data.user, data.data.accessToken);
      toast.success('Login successful!');
      navigate('/dashboard');
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error((error as AxiosError<ApiError>).response?.data?.message || 'Login failed');
    },
  });

    // Logout mutation
    const logoutMutation = useMutation({
        mutationFn: authApi.logout,
        onSuccess: () => {
          logout();
          queryClient.clear();
          toast.success('Logged out successfully');
          navigate('/signin');
        },
        onError: (error: AxiosError<ApiError>) => {
          toast.error(error.response?.data?.message || 'Logout failed');
        },
      });

        // Get current user
  const { data: userData, isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: authApi.getCurrentUser,
    enabled: isAuthenticated,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  return {
    user,
    isAuthenticated,
    isLoading,
    register: registerMutation.mutate,
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    isRegistering: registerMutation.isPending,
    isLoggingIn: loginMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
  };
}