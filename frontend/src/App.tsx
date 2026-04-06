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
import ExamSetup from './pages/ExamSetup';
import ExamSession from './pages/ExamSession';
import ExamResults from './pages/ExamResults';
import ExamReview from './pages/ExamReview';
import Profile from './pages/Profile';

// Admin Pages
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AcademicStructure from './pages/admin/AcademicStructure';
import AdminQuestionBank from './pages/admin/AdminQuestionBank';
import Students from './pages/admin/Students';
import ExamActivity from './pages/admin/ExamActivity';
import AdminQuestionEditor from './pages/AdminQuestionEditor';

import { LoginPage, RegisterPage } from './features/auth/AuthPages';

// Auth Guard
import { useAuthStore } from './store/authStore';

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (isAuthenticated) {
    if (!user?.registration_id && user?.role === 'student') {
      return <Navigate to="/auth/onboarding" replace />;
    }
    return <Navigate to={user?.role === 'admin' ? "/admin/dashboard" : "/dashboard"} replace />;
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
          <Route element={<ProtectedRoute><Outlet /></ProtectedRoute>}>
            {/* Dashboard Layout Routes */}
            <Route element={<DashboardLayout />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="courses" element={<CourseExplorer />} />
              <Route path="courses/:courseId" element={<DisciplineExplorer />} />
              <Route path="bookmarks" element={<QuestionBank />} />
              <Route path="mistakes" element={<MistakeBank />} />
              <Route path="analytics" element={<AnalyticsDashboard />} />
              <Route path="exams" element={<ExamSetup />} />
              <Route path="profile" element={<Profile />} />
            </Route>

            {/* Immersive / Full-Screen Layout Routes */}
            <Route element={<div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-inter"><Outlet /></div>}>
              <Route path="practice" element={<PracticeSession />} />
              <Route path="exam-session" element={<ExamSession />} />
              <Route path="exam-results/:sessionId" element={<ExamResults />} />
              <Route path="exam-review/:sessionId" element={<ExamReview />} />
              <Route path="results/:sessionId" element={<SessionResults />} />
            </Route>
          </Route>

          <Route 
            path="/admin" 
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="structure" element={<AcademicStructure />} />
            <Route path="questions" element={<AdminQuestionBank />} />
            <Route path="questions/new" element={<AdminQuestionEditor />} />
            <Route path="questions/edit/:id" element={<AdminQuestionEditor />} />
            <Route path="students" element={<Students />} />
            <Route path="activity" element={<ExamActivity />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
