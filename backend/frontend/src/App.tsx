
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import { ProtectedRoute } from './hooks/ProtectedRoute';
import DashboardPage from './pages/Dashboard';

function App() {

  const queryClient = new QueryClient({
    defaultOptions:{
      queries:{
        refetchOnWindowFocus:false,
        retry:1,
      }
    }
  });
  

  return (
   <QueryClientProvider client={queryClient}>
    <BrowserRouter>
    <Routes>
       {/* Public routes */}
       <Route path="/" element={<HomePage />} />
          <Route path="/signin" element={<LoginPage />} />
          <Route path="/signup" element={<RegisterPage />} />
          {/* <Route path="/create-tenant" element={<CreateTenantPage />} /> */}

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
      </Route>
    </Routes>
    </BrowserRouter>
   </QueryClientProvider>
  )
}

export default App
