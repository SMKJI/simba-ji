
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Register from "./pages/Register";
import Helpdesk from "./pages/Helpdesk";
import Success from "./pages/Success";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import GroupDetail from "./pages/GroupDetail";
import FAQ from "./pages/FAQ";
import Programs from "./pages/Programs"; 
import About from "./pages/About";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/register" element={<Register />} />
          <Route path="/success" element={<Success />} />
          <Route path="/login" element={<Login />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/about" element={<About />} />
          
          {/* Protected Routes */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Admin />
            </ProtectedRoute>
          } />
          <Route path="/helpdesk" element={
            <ProtectedRoute allowedRoles={['admin', 'helpdesk']}>
              <Helpdesk />
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute allowedRoles={['admin', 'helpdesk', 'applicant']}>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute allowedRoles={['admin', 'helpdesk', 'applicant']}>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/group-detail/:id" element={
            <ProtectedRoute allowedRoles={['admin', 'helpdesk', 'applicant']}>
              <GroupDetail />
            </ProtectedRoute>
          } />
          
          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
