
import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { RegistrationsProvider } from '@/hooks/useRegistrations';
import { Toaster } from '@/components/ui/toaster';
import ProtectedRoute from '@/components/ProtectedRoute';

// Pages
import Index from '@/pages/Index';
import About from '@/pages/About';
import Programs from '@/pages/Programs';
import FAQ from '@/pages/FAQ';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Dashboard from '@/pages/Dashboard';
import Success from '@/pages/Success';
import GroupDetail from '@/pages/GroupDetail';
import Profile from '@/pages/Profile';
import Helpdesk from '@/pages/Helpdesk';
import StudentHelpdesk from '@/pages/StudentHelpdesk';
import OfflineHelpdesk from '@/pages/OfflineHelpdesk';
import QueueDisplay from '@/pages/QueueDisplay';
import Admin from '@/pages/Admin';
import Content from '@/pages/Content';
import ContentManager from '@/pages/ContentManager';
import NotFound from '@/pages/NotFound';

import './App.css';

function App() {
  useEffect(() => {
    document.title = 'SMKN 1 Kendal - Sistem PMB';
  }, []);

  return (
    <RegistrationsProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/queue-display" element={<QueueDisplay />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/success" element={
            <ProtectedRoute>
              <Success />
            </ProtectedRoute>
          } />
          <Route path="/group/:id" element={
            <ProtectedRoute>
              <GroupDetail />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/helpdesk" element={
            <ProtectedRoute roles={['helpdesk', 'admin']}>
              <Helpdesk />
            </ProtectedRoute>
          } />
          <Route path="/student-helpdesk" element={
            <ProtectedRoute>
              <StudentHelpdesk />
            </ProtectedRoute>
          } />
          <Route path="/offline-helpdesk" element={
            <ProtectedRoute roles={['helpdesk_offline', 'admin']}>
              <OfflineHelpdesk />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute roles={['admin']}>
              <Admin />
            </ProtectedRoute>
          } />
          <Route path="/content" element={
            <ProtectedRoute roles={['content', 'admin']}>
              <Content />
            </ProtectedRoute>
          } />
          <Route path="/content-manager" element={
            <ProtectedRoute roles={['content', 'admin']}>
              <ContentManager />
            </ProtectedRoute>
          } />
          
          {/* 404 Page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </Router>
    </RegistrationsProvider>
  );
}

export default App;
