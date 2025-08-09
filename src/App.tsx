import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Register from './pages/Register';
import Home from './pages/Home';
import Login from './pages/login';
import ProtectedRoute from './features/auth/ProtectedRoute';


export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <h1 className="p-4 text-3xl">Dashboard (Protected)</h1>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}
