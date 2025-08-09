import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Register from './pages/Register';
import Home from './pages/Home';
import Login from './pages/login';
import ProtectedRoute from './features/auth/ProtectedRoute';
import Layout from './components/Layout';


export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        </Route>
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
