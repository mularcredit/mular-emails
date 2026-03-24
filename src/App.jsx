import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';
import LoginPage from './pages/LoginPage';
import ComposePage from './pages/ComposePage';
import LogsPage from './pages/LogsPage';
import TemplatesPage from './pages/TemplatesPage';
import ContactsPage from './pages/ContactsPage';
import DraftsPage from './pages/DraftsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import BrevoSettingsPage from './pages/BrevoSettingsPage';
import SmtpSettingsPage from './pages/SmtpSettingsPage';
import ProfilePage from './pages/ProfilePage';
import DraftsPage from './pages/DraftsPage';
import { Toaster } from 'react-hot-toast';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Layout>{children}</Layout>;
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/compose" replace /> : <LoginPage />} />
      <Route path="/compose" element={<ProtectedRoute><ComposePage /></ProtectedRoute>} />
      <Route path="/drafts" element={<ProtectedRoute><DraftsPage /></ProtectedRoute>} />
      <Route path="/logs" element={<ProtectedRoute><LogsPage /></ProtectedRoute>} />
      <Route path="/templates" element={<ProtectedRoute><TemplatesPage /></ProtectedRoute>} />
      <Route path="/contacts" element={<ProtectedRoute><ContactsPage /></ProtectedRoute>} />
      <Route path="/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
      <Route path="/settings/brevo" element={<ProtectedRoute><BrevoSettingsPage /></ProtectedRoute>} />
      <Route path="/settings/smtp" element={<ProtectedRoute><SmtpSettingsPage /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/" element={<Navigate to="/compose" replace />} />
      <Route path="*" element={<Navigate to="/compose" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1f2937',
              color: '#f9fafb',
              borderRadius: '10px',
              fontSize: '13px',
              padding: '10px 14px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
            },
            success: { iconTheme: { primary: '#10b981', secondary: '#f9fafb' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#f9fafb' } },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}
