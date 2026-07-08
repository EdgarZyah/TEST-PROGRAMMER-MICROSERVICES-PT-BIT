import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import UserManagement from './pages/UserManagement';
import MasterProduct from './pages/MasterProduct';
import PembelianProduk from './pages/PembelianProduk';
import HistoryPembayaran from './pages/HistoryPembayaran';

function ProtectedRoute({ children, role }: { children: React.ReactNode; role?: string }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (role && user?.role !== role) {
    return <Navigate to={user?.role === 'admin' ? '/admin/dashboard' : '/pembeli/beli'} replace />;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar role={user?.role as 'admin' | 'pembeli'} />
      <main className="ml-64 flex-1 p-8 relative">
        {children}
      </main>
    </div>
  );
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  if (isAuthenticated) {
    return <Navigate to={user?.role === 'admin' ? '/admin/dashboard' : '/pembeli/beli'} replace />;
  }
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/admin/dashboard" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute role="admin"><UserManagement /></ProtectedRoute>} />
      <Route path="/admin/products" element={<ProtectedRoute role="admin"><MasterProduct /></ProtectedRoute>} />
      <Route path="/pembeli/beli" element={<ProtectedRoute role="pembeli"><PembelianProduk /></ProtectedRoute>} />
      <Route path="/pembeli/history" element={<ProtectedRoute role="pembeli"><HistoryPembayaran /></ProtectedRoute>} />
      <Route path="/" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="*" element={<PublicRoute><Login /></PublicRoute>} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
