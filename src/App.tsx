import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Home from './pages/Home';
import Layout from './components/Layout';
import ExamStart from './features/exams/ExamStart';
import Login from './pages/login';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  // আপনি চাইলে এখানে user level state রাখতে পারেন,
  // অথবা Redux থেকে handle করতে পারেন।

  return (
    <Router>
      <Routes>
        {/* Layout এর মধ্যে public routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <h1 className="p-4 text-3xl">Dashboard (Protected)</h1>
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
