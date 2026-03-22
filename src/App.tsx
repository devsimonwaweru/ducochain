import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import UploadDocument from './pages/UploadDocument';
import DocumentRecords from './pages/DocumentRecords';
import VerifyDocument from './pages/VerifyDocument';
import BlockchainLedger from './pages/BlockchainLedger';
import Reports from './pages/Reports';
import UserManagement from './pages/UserManagement';
import Settings from './pages/Settings';
import InstallPrompt from './components/InstallPrompt';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          
          <Route path="/upload" element={
            <ProtectedRoute allowedRoles={['Admin', 'Supplier']}>
              <UploadDocument />
            </ProtectedRoute>
          } />
          
          <Route path="/records" element={
            <ProtectedRoute allowedRoles={['Admin', 'Supplier', 'Retailer', 'Transporter']}>
              <DocumentRecords />
            </ProtectedRoute>
          } />
          
          <Route path="/verify" element={
            <ProtectedRoute allowedRoles={['Admin', 'Retailer']}>
              <VerifyDocument />
            </ProtectedRoute>
          } />
          
          <Route path="/ledger" element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <BlockchainLedger />
            </ProtectedRoute>
          } />
          
          <Route path="/reports" element={
            <ProtectedRoute allowedRoles={['Admin', 'Retailer']}>
              <Reports />
            </ProtectedRoute>
          } />
          
          <Route path="/users" element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <UserManagement />
            </ProtectedRoute>
          } />
          
          <Route path="/settings" element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <Settings />
            </ProtectedRoute>
          } />

          {/* Redirects */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
        <InstallPrompt />
      </Router>
    </AuthProvider>
  );
}

export default App;