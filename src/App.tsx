import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Home from './pages/Home';
import Layout from './components/Layout';
import ExamStart from './features/exams/ExamStart';
import Login from './pages/login';
import ProtectedRoute from './components/ProtectedRoute';
import type { RootState } from './app/store';
import { useSelector } from 'react-redux';
import StudentDashboard from './dashboard/StudentDashboard';
import AdminDashboard from './dashboard/AdminDashboard';
import SupervisorDashboard from './dashboard/SupervisorDashboard';
import EmailVerification from './pages/EmailVerification';

export default function App() {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <Router>
      <Routes>
        {/* Layout এর মধ্যে public routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="register" element={<Register />} />
          <Route path="verify-email" element={<EmailVerification/>} />
        </Route>

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              {user?.role === 'student' ? (
                <StudentDashboard />
              ) : user?.role === 'admin' ? (
                <AdminDashboard />
              ) : user?.role === 'supervisor' ? (
                <SupervisorDashboard />
              ) : (<Login />
                
              )}
            </ProtectedRoute>

          }
        />

        {/* Protected Exam Route with step param */}
        <Route
          path="/exam/:step"
          element={
            <ProtectedRoute>
              <ExamStart
                step={1} // এখানে step param নিয়ে dynamic handle করতে পারেন (useParams থেকে)
                onFinish={(certifiedLevel) =>
                  console.log('Certified Level:', certifiedLevel)
                }
              />
            </ProtectedRoute>
          }
        />

        {/* Catch-all route can be added if you want */}
      </Routes>
    </Router>
  );
}
