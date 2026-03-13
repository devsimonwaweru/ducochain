import React, { useState } from 'react';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import { FileText, CheckCircle, Clock, AlertTriangle, ArrowUpRight, Blocks, Upload, ShieldCheck } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const user = { name: 'Simon Kamau', role: 'Admin', initials: 'SK' };
  
  const stats = [
    { title: 'Total Documents', value: 148, icon: FileText, color: 'primary', bgColor: 'bg-primary/10' },
    { title: 'Verified Documents', value: 112, icon: CheckCircle, color: 'verified', bgColor: 'bg-verified/10' },
    { title: 'Pending', value: 23, icon: Clock, color: 'pending', bgColor: 'bg-pending/10' },
    { title: 'Flagged', value: 13, icon: AlertTriangle, color: 'flagged', bgColor: 'bg-flagged/10' },
  ];

  return (
    <div className="min-h-screen bg-app-bg">
      <Header user={user} onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      <div className="flex pt-16">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        <main className="flex-1 lg:ml-64 p-6">
          {/* Welcome Banner */}
          <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-gray-100 animate-fade-in">
            <h2 className="text-2xl font-bold text-primary font-display">Welcome back, {user.name}</h2>
            <p className="text-gray-500 mt-1">DocuChain helps you securely track and verify supply chain documents.</p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <a href="/upload" className="bg-white p-5 rounded-xl border border-gray-100 hover:shadow-md transition-all text-left group animate-slide-up">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Upload className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900">Upload Document</h3>
              <p className="text-xs text-gray-500">Upload invoices & receipts</p>
            </a>
            
            <a href="/verify" className="bg-white p-5 rounded-xl border border-gray-100 hover:shadow-md transition-all text-left group animate-slide-up delay-100">
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900">Verify Document</h3>
              <p className="text-xs text-gray-500">Check authenticity</p>
            </a>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map((stat) => (
              <div key={stat.title} className="bg-white rounded-xl p-5 border border-gray-100 hover:shadow-sm transition-all animate-slide-up">
                <div className={`p-2 rounded-lg w-fit ${stat.bgColor}`}>
                  <stat.icon className={`w-5 h-5 text-${stat.color}`} />
                </div>
                <p className="text-2xl font-bold text-gray-900 mt-3">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.title}</p>
              </div>
            ))}
          </div>

          {/* Table Section */}
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden animate-slide-up delay-300">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-semibold text-gray-900">Recent Activity</h3>
              <a href="/records" className="text-sm text-secondary hover:text-secondary-dark flex items-center gap-1 transition-colors">
                View All <ArrowUpRight className="w-3 h-3" />
              </a>
            </div>
            <div className="p-10 text-center text-gray-400 border-2 border-dashed m-5 rounded-lg">
              <Blocks className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>Recent verified documents will appear here</p>
              <p className="text-xs">(Connect to Supabase to fetch data)</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;