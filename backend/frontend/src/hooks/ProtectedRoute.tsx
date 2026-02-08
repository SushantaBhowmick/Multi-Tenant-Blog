
import { useAuthStore } from "@/store/authStore";
import { Navigate, Outlet } from "react-router-dom";


interface ProtectedRouteProps {
    allowedRoles?: string[];
}

export const ProtectedRoute=({allowedRoles}:ProtectedRouteProps)=> {
    const {user,isAuthenticated} = useAuthStore();
    if(!isAuthenticated){
        return <Navigate to='/signin' replace />
    }
    if(allowedRoles && user && !allowedRoles.includes(user.role)){
        return <Navigate to='/unauthorized' replace />
    };

    return <Outlet />;
}