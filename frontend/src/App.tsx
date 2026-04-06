import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Layouts
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import LandingPage from './pages/LandingPage';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import CourseExplorer from './pages/CourseExplorer';
import DisciplineExplorer from './pages/DisciplineExplorer';
import QuestionBank from './pages/QuestionBank';
import PracticeSession from './pages/PracticeSession';
import SessionResults from './pages/SessionResults';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import MistakeBank from './pages/MistakeBank';

// Admin Pages
import AdminLayout from './layouts/AdminLayout';
import AdminQuestionList from './pages/AdminQuestionList';
import AdminQuestionEditor from './pages/AdminQuestionEditor';

import { LoginPage, RegisterPage } from './features/auth/AuthPages';

// Auth Guard
import { useAuthStore } from './store/authStore';

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (isAuthenticated) {
    if (!user?.registration_id) return <Navigate to="/auth/onboarding" replace />;
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/auth/login" replace />;
  if (user && !user.registration_id) return <Navigate to="/auth/onboarding" replace />;
  return <>{children}</>;
};

const OnboardingGuard = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/auth/login" replace />;
  if (user?.registration_id) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/auth/login" replace />;
  if (user?.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
};

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
          
          {/* Auth Routes */}
          <Route path="/auth" element={<AuthLayout />}>
            <Route path="login" element={<PublicRoute><LoginPage /></PublicRoute>} />
            <Route path="register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
            <Route path="onboarding" element={<OnboardingGuard><Onboarding /></OnboardingGuard>} />
          </Route>

          {/* Student/Private Routes */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="courses" element={<CourseExplorer />} />
            <Route path="courses/:courseId" element={<DisciplineExplorer />} />
            <Route path="bookmarks" element={<QuestionBank />} />
            <Route path="mistakes" element={<MistakeBank />} />
            <Route path="analytics" element={<AnalyticsDashboard />} />
            <Route path="profile" element={<div>Profile Settings</div>} />
          </Route>

          {/* Full-Screen Immersive Routes */}
          <Route 
            path="/"
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-inter">
                  <Outlet />
                </div>
              </ProtectedRoute>
            }
          >
            <Route path="practice" element={<PracticeSession />} />
            <Route path="results/:sessionId" element={<SessionResults />} />
          </Route>

          {/* Admin Routes */}
          <Route 
            path="/admin" 
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" />} />
            <Route path="dashboard" element={<div>Admin Hub Overview</div>} />
            <Route path="questions" element={<AdminQuestionList />} />
            <Route path="questions/new" element={<AdminQuestionEditor />} />
            <Route path="questions/edit/:id" element={<AdminQuestionEditor />} />
            <Route path="curriculum" element={<div>Curriculum Management</div>} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
