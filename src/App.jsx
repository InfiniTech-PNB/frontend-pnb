import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Auth Guards
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from "./components/PublicRoute";

// Layout & Auth Pages
import Login from './pages/auth/Login';
import DashboardLayout from './pages/dashboard/DashboardLayout';

// Dashboard Tabs (Import your individual tab components here)
import HomeTab from './pages/dashboard/tabs/HomeTab';
import ScanTab from './pages/dashboard/tabs/ScanTab';
import ScanResultsTab from './pages/dashboard/tabs/ScanResultsTab';
import HistoryTab from './pages/dashboard/tabs/HistoryTab';
import CBOMHistoryTab from './pages/dashboard/tabs/CBOMHistoryTab';
import AssetInventoryTab from './pages/dashboard/tabs/AssetInventoryTab';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          
          {/* 1. PUBLIC ROUTES */}
          {/* PublicRoute prevents logged-in users from seeing the login page again */}
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />

          {/* 2. PROTECTED DASHBOARD ROUTES (Nested Architecture) */}
          {/* Wrapping DashboardLayout in ProtectedRoute covers all children automatically */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            {/* The index route renders HomeTab at '/dashboard' */}
            <Route index element={<HomeTab />} />
            
            {/* These routes render at '/dashboard/scan', '/dashboard/results', etc. */}
            <Route path="scan" element={<ScanTab />} />
            <Route path="results" element={<ScanResultsTab />} />
            <Route path="assets" element={<AssetInventoryTab />} />
            <Route path="history" element={<HistoryTab />} />
            <Route path="cbom" element={<CBOMHistoryTab />} />
          </Route>

          {/* 3. REDIRECTS & FALLBACKS */}
          {/* Root redirect: send to dashboard if logged in, ProtectedRoute handles the rest */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* 404 Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;