import RegisterForm from "@/components/auth/RegisterForm";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
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
    <h2 className="text-2xl font-bold text-center mb-6">Create an account</h2>
       <RegisterForm />
     </div>
   </div>
  );
};

export default RegisterPage;