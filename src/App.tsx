
import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Index from '@/pages/Index';
import About from '@/pages/About';
import Programs from '@/pages/Programs';
import FAQ from '@/pages/FAQ';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Dashboard from '@/pages/Dashboard';
import Profile from '@/pages/Profile';
import Admin from '@/pages/Admin';
import Content from '@/pages/Content';
import Helpdesk from '@/pages/Helpdesk';
import StudentHelpdesk from '@/pages/StudentHelpdesk';
import GroupDetail from '@/pages/GroupDetail';
import Success from '@/pages/Success';
import NotFound from '@/pages/NotFound';
import ProtectedRoute from '@/components/ProtectedRoute';

const App = () => {
  // You can add any global state or context here if needed
  // For example, authentication context, theme context, etc.

  return (
    <div className="min-h-screen flex flex-col">
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected routes for applicants */}
          <Route element={<ProtectedRoute allowedRoles={['applicant']}><Outlet /></ProtectedRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/group-detail/:id" element={<GroupDetail />} />
            <Route path="/success" element={<Success />} />
            <Route path="/helpdesk-siswa" element={<StudentHelpdesk />} />
          </Route>
          
          {/* Protected routes for helpdesk and admin */}
          <Route element={<ProtectedRoute allowedRoles={['helpdesk', 'admin']}><Outlet /></ProtectedRoute>}>
            <Route path="/helpdesk" element={<Helpdesk />} />
          </Route>
          
          {/* Protected routes for admin only */}
          <Route element={<ProtectedRoute allowedRoles={['admin']}><Outlet /></ProtectedRoute>}>
            <Route path="/admin" element={<Admin />} />
          </Route>
          
          {/* Protected routes for content and admin */}
          <Route element={<ProtectedRoute allowedRoles={['content', 'admin']}><Outlet /></ProtectedRoute>}>
            <Route path="/content" element={<Content />} />
          </Route>
          
          {/* 404 Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </Router>
    </div>
  );
};

export default App;
