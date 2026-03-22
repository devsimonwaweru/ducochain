import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, LogIn, Shield, Users, Truck, UserCircle, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const roleIcons = {
  Supplier: Briefcase,
  Retailer: UserCircle,
  Transporter: Truck,
  Auditor: Shield,
  Admin: Users,
};

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // Get login function from context
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<keyof typeof roleIcons>('Supplier'); // Visual only
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Attempt login via Context
    const success = login(email, password);
    
    setTimeout(() => {
      setIsLoading(false);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Invalid credentials. Please use a Demo Account below.');
      }
    }, 1000);
  };

  // Fill credentials based on the hardcoded users in AuthContext
  const fillDemoCredentials = (selectedRole: string) => {
    setRole(selectedRole as keyof typeof roleIcons);
    
    const credentials: { [key: string]: { email: string; pass: string } } = {
      'Admin': { email: 'admin@docuchain.com', pass: 'admin123' },
      'Supplier': { email: 'supplier@test.com', pass: 'supplier123' },
      'Retailer': { email: 'retailer@test.com', pass: 'retailer123' },
      'Transporter': { email: 'transporter@test.com', pass: 'transporter123' },
    };
    
    if (credentials[selectedRole]) {
      setEmail(credentials[selectedRole].email);
      setPassword(credentials[selectedRole].pass);
    }
  };

  return (
    <div className="min-h-screen bg-app-bg flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#E5E7EB" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-secondary rounded-full filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary rounded-full filter blur-3xl opacity-20"></div>
      </div>

      {/* Branding */}
      <div className="relative z-10 text-center mb-8">
        <div className="flex flex-col items-center justify-center gap-3 mb-2">
          <img src="/logo.png" alt="DocuChain Logo" className="h-12 w-auto object-contain" />
        </div>
        <h1 className="text-3xl font-bold text-primary tracking-tight font-display">DocuChain</h1>
        <p className="text-gray-600 text-sm font-medium tracking-wide mt-1">
          Secure Supply Chain Document Tracking System
        </p>
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Login to Your Account</h2>
            <p className="text-gray-500 text-sm mt-1">Access the blockchain platform</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 bg-flagged/10 text-flagged text-sm text-center p-3 rounded-lg border border-flagged/20">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-12 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Role Selector (Visual Only) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Acting Role</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                   {role && React.createElement(roleIcons[role], { className: "w-5 h-5 text-gray-400" })}
                </div>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as keyof typeof roleIcons)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent appearance-none cursor-pointer transition-all"
                >
                  <option value="Supplier">Supplier</option>
                  <option value="Retailer">Retailer</option>
                  <option value="Transporter">Transporter</option>
                  <option value="Admin">Admin</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50"
            >
              {isLoading ? 'Verifying...' : (
                <>
                  <LogIn className="w-5 h-5" /> Login
                </>
              )}
            </button>

            <div className="text-center mt-4">
              <a href="#" className="text-sm text-secondary hover:text-secondary-dark font-medium transition-colors">
                Forgot Password?
              </a>
            </div>
          </form>

          {/* Demo Accounts */}
          <div className="my-6 border-t border-gray-100 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-white px-4 text-xs text-gray-400 uppercase tracking-wider">Demo Accounts</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {['Admin', 'Supplier', 'Retailer', 'Transporter'].map((demoRole) => (
              <button
                key={demoRole}
                type="button"
                onClick={() => fillDemoCredentials(demoRole)}
                className="px-2 py-2 text-xs font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
              >
                {demoRole}
              </button>
            ))}
          </div>

        </div>
      </div>

      <footer className="relative z-10 text-center mt-8 text-xs text-gray-500">
        <p>DocuChain © 2026 | Blockchain-Based Document Tracking</p>
      </footer>

    </div>
  );
};

export default LoginPage;