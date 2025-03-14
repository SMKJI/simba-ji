
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
import Content from "./pages/Content";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/register" element={<Register />} />
          <Route path="/helpdesk" element={<Helpdesk />} />
          <Route path="/success" element={<Success />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Admin />
            </ProtectedRoute>
          } />
          <Route path="/content" element={
            <ProtectedRoute allowedRoles={['admin', 'content']}>
              <Content />
            </ProtectedRoute>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
