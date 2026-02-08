import LoginForm from "@/components/auth/LoginForm";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const {isAuthenticated} = useAuth();

  const navigate = useNavigate();

 useEffect(()=>{
  if(isAuthenticated){
    navigate('/dashboard');
  }
 },[isAuthenticated,navigate]);


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
   <div className="w-full max-w-md border rounded-lg p-6 bg-white shadow-md">
   <h2 className="text-2xl font-bold text-center mb-6">Login to your account</h2>
      <LoginForm />
    </div>
  </div>
);
};

export default LoginPage;