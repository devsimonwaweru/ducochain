/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import { FileText, CheckCircle, Clock, AlertTriangle, ArrowUpRight, Blocks, Upload, ShieldCheck } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // State for Real Data
  const [stats, setStats] = useState([
    { title: 'Total Documents', value: '...', icon: FileText, color: 'primary' },
    { title: 'Verified Documents', value: '...', icon: CheckCircle, color: 'verified' },
    { title: 'Pending', value: '...', icon: Clock, color: 'pending' },
    { title: 'Flagged', value: '...', icon: AlertTriangle, color: 'flagged' },
  ]);
  const [recentDocs, setRecentDocs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch Data from Supabase
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // 1. Fetch all documents to calculate stats
      const { data: allDocs, error: docsError } = await supabase
        .from('documents')
        .select('status');

      if (docsError) throw docsError;

      // Calculate Counts
      const total = allDocs?.length || 0;
      const verified = allDocs?.filter(d => d.status === 'Verified').length || 0;
      const pending = allDocs?.filter(d => d.status === 'Pending').length || 0;
      const flagged = allDocs?.filter(d => d.status === 'Flagged').length || 0;

      setStats([
        { title: 'Total Documents', value: total.toString(), icon: FileText, color: 'primary' },
        { title: 'Verified Documents', value: verified.toString(), icon: CheckCircle, color: 'verified' },
        { title: 'Pending', value: pending.toString(), icon: Clock, color: 'pending' },
        { title: 'Flagged', value: flagged.toString(), icon: AlertTriangle, color: 'flagged' },
      ]);

      // 2. Fetch recent 5 documents
      const { data: recent, error: recentError } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (recentError) throw recentError;
      setRecentDocs(recent || []);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusClasses = (status: string) => {
    switch (status) {
      case 'Verified': return 'bg-verified/10 text-verified';
      case 'Pending': return 'bg-pending/10 text-pending';
      case 'Flagged': return 'bg-flagged/10 text-flagged';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-app-bg">
      <Header user={user!} onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      <div className="flex pt-16">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        <main className="flex-1 lg:ml-64 p-6">
          {/* Welcome Banner */}
          <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-gray-100 animate-fade-in">
            <h2 className="text-2xl font-bold text-primary font-display">Welcome back, {user?.name || 'User'}</h2>
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

          {/* Stats Grid (Real Data) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl p-5 border border-gray-100 hover:shadow-sm transition-all animate-slide-up">
                <div className={`p-2 rounded-lg w-fit bg-${stat.color}/10`}>
                  <stat.icon className={`w-5 h-5 text-${stat.color}`} />
                </div>
                <p className="text-2xl font-bold text-gray-900 mt-3">
                  {loading ? '...' : stat.value}
                </p>
                <p className="text-sm text-gray-500">{stat.title}</p>
              </div>
            ))}
          </div>

          {/* Recent Activity Table (Real Data) */}
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden animate-slide-up delay-300">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-semibold text-gray-900">Recent Activity</h3>
              <a href="/records" className="text-sm text-secondary hover:text-secondary-dark flex items-center gap-1 transition-colors">
                View All <ArrowUpRight className="w-3 h-3" />
              </a>
            </div>
            
            {loading ? (
              <div className="p-10 text-center text-gray-400">Loading data...</div>
            ) : recentDocs.length === 0 ? (
              <div className="p-10 text-center text-gray-400 border-2 border-dashed m-5 rounded-lg">
                <Blocks className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No documents found.</p>
                <p className="text-xs">Upload a document to see activity here.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase px-5 py-3">Doc ID</th>
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase px-5 py-3">Type</th>
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase px-5 py-3">Supplier</th>
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase px-5 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {recentDocs.map((doc) => (
                      <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-3 font-mono text-sm text-primary font-medium">{doc.doc_id}</td>
                        <td className="px-5 py-3 text-sm text-gray-600">{doc.type}</td>
                        <td className="px-5 py-3 text-sm text-gray-500">{doc.supplier}</td>
                        <td className="px-5 py-3">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusClasses(doc.status)}`}>
                            {doc.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </main>
      </div>
    </div>
  );
};

export default Dashboard;