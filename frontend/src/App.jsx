import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';
import AdminLayout from './layouts/AdminLayout';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Courses from './pages/Courses';
import LessonDetail from './pages/LessonDetail';
import QuizDetail from './pages/QuizDetail';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminCourses from './pages/AdminCourses';
import Profile from './pages/Profile';
import QuizHistory from './pages/QuizHistory';


// Route Guards
const ProtectedRoute = ({ children, allowedRole }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        gap: '16px',
        backgroundColor: 'var(--background)'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          border: '3px solid var(--border)',
          borderTopColor: 'var(--primary)',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ fontWeight: 500, color: 'var(--text-muted)' }}>Đang tải hệ thống...</p>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user && user.roles) {
    const hasRole = user.roles.includes(allowedRole);
    if (!hasRole) {
      // If student trying to access admin
      if (allowedRole === 'ROLE_ADMIN') {
        return <Navigate to="/dashboard" replace />;
      }
      // If admin trying to access student
      if (allowedRole === 'ROLE_STUDENT' && user.roles.includes('ROLE_ADMIN')) {
        return <Navigate to="/admin" replace />;
      }
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

// Redirect if already authenticated
const GuestRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) return null;

  if (isAuthenticated && user) {
    if (user.roles.includes('ROLE_ADMIN')) {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={
              <GuestRoute>
                <Login />
              </GuestRoute>
            } />
            <Route path="/register" element={
              <GuestRoute>
                <Register />
              </GuestRoute>
            } />
          </Route>

          {/* Student Routes */}
          <Route path="/" element={
            <ProtectedRoute allowedRole="ROLE_STUDENT">
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="courses" element={<Courses />} />
            <Route path="courses/:courseId/lessons/:lessonId" element={<LessonDetail />} />
            <Route path="lessons/:lessonId/quizzes" element={<QuizDetail />} />
            <Route path="bookmarks" element={<StudentDashboard />} /> {/* Fallback or identical bookmark display */}
            <Route path="quiz-history" element={<QuizHistory />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRole="ROLE_ADMIN">
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="courses" element={<AdminCourses />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
