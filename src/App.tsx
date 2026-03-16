import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import UploadDocument from './pages/UploadDocument';
import DocumentRecords from './pages/DocumentRecords';
import VerifyDocument from './pages/VerifyDocument';
import BlockchainLedger from './pages/BlockchainLedger';
import Reports from './pages/Reports';
import UserManagement from './pages/UserManagement';
import Settings from './pages/Settings';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/upload" element={<UploadDocument />} />
        <Route path="/records" element={<DocumentRecords />} />
        <Route path="/verify" element={<VerifyDocument />} />
        <Route path="/ledger" element={<BlockchainLedger />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/settings" element={<Settings />} />
        
        <Route path="*" element={
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-800">404 - Page Not Found</h1>
              <a href="/login" className="text-secondary hover:underline mt-4 block">Go to Login</a>
            </div>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;