import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import withAuth from './components/misc/WithAuth';
import AdminPage from './pages/AdminPage';
import DeanDashboard from './pages/DeanPage';

function App() {
  console.log("App loaded"); // Debug log
  const ProtectedAdminPage = withAuth(AdminPage, 1);
  const ProtectedDeanDashboard = withAuth(DeanDashboard, 2);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/admin" element={<ProtectedAdminPage />} />
        <Route path="/dean-dashboard" element={<ProtectedDeanDashboard />} />
        {/* Add other protected routes similarly */}
      </Routes>
    </Router>
  );
}

export default App;
