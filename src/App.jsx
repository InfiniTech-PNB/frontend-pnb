import './App.css';
import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { FeedbackProvider } from './context/FeedbackContext';

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
import ReportingTab from './pages/dashboard/tabs/ReportingTab';
import ReportingRegistry from './pages/dashboard/tabs/ReportingRegistry';
import ScheduledReportingTab from './pages/dashboard/tabs/ScheduledReportingTab';
import OnDemandReportingTab from './pages/dashboard/tabs/OnDemandReportingTab';
import ExecutivesReportingTab from './pages/dashboard/tabs/ExecutivesReportingTab';
import DomainSummaryTab from './pages/dashboard/tabs/DomainSummaryTab';

function App() {
  useEffect(() => {
    // 1. Check if user has a saved preference
    const savedTheme = localStorage.getItem('pnb-theme');

    // 2. Check if the system OS is set to dark
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // 3. Apply the correct class immediately
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);
  return (
    <AuthProvider>
      <FeedbackProvider>
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
            <Route path="summary" element={<DomainSummaryTab />} />

            {/* These routes render at '/dashboard/scan', '/dashboard/results', etc. */}
            <Route path="scan" element={<ScanTab />} />
            <Route path="results" element={<ScanResultsTab />} />
            <Route path="assets" element={<AssetInventoryTab />} />
            <Route path="history" element={<HistoryTab />} />
            <Route path="cbom" element={<CBOMHistoryTab />} />
            {/* In App.jsx, find the reporting route and change it to this: */}

            <Route path="reporting" element={<ReportingTab />}>
              {/* 1. This shows the 3-circle menu at '/dashboard/reporting' */}
              <Route index element={<ReportingRegistry />} />

              {/* 2. These show the detail tabs at the specific URLs */}
              <Route path="executive" element={<ExecutivesReportingTab />} />
              <Route path="scheduled" element={<ScheduledReportingTab />} />
              <Route path="ondemand" element={<OnDemandReportingTab />} />
            </Route>
          </Route>

            {/* 3. REDIRECTS & FALLBACKS */}
            {/* Root redirect: send to dashboard if logged in, ProtectedRoute handles the rest */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* 404 Fallback */}
            <Route path="*" element={<Navigate to="/login" replace />} />

          </Routes>
        </Router>
      </FeedbackProvider>
    </AuthProvider>
  );
}

export default App;