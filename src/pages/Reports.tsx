import React, { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import { FileText, CheckCircle, Clock, AlertTriangle, Download, TrendingUp, PieChart as PieIcon, BarChart2, Loader2, Link } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';

interface BlockchainRecord {
  tx_hash: string;
  block_number: number;
}

interface Document {
  id: string;
  doc_id: string;
  type: string;
  supplier: string;
  receiver: string;
  status: string;
  created_at: string;
  blockchain_records: BlockchainRecord[];
}

const Reports: React.FC = () => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('documents')
        .select(`
          id,
          doc_id,
          type,
          supplier,
          receiver,
          status,
          created_at,
          blockchain_records (
            tx_hash,
            block_number
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
  };

  // --- Dynamic Calculations ---
  const totalDocs = documents.length;
  const verifiedCount = documents.filter(d => d.status === 'Verified').length;
  const pendingCount = documents.filter(d => d.status === 'Pending').length;
  const flaggedCount = documents.filter(d => d.status === 'Flagged').length;
  const anchoredCount = documents.filter(d => d.blockchain_records && d.blockchain_records.length > 0).length;

  // Aggregation Helpers
  const getMostFrequent = (key: keyof Document) => {
    if (documents.length === 0) return 'N/A';
    const counts: Record<string, number> = {};
    documents.forEach(doc => {
      const val = doc[key] as string;
      if (val) counts[val] = (counts[val] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
  };

  const getPeakDay = () => {
    if (documents.length === 0) return 'N/A';
    const counts: Record<string, number> = {};
    documents.forEach(doc => {
      const day = new Date(doc.created_at).toLocaleDateString('en-US', { weekday: 'long' });
      counts[day] = (counts[day] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
  };

  const mostUploaded = getMostFrequent('type');
  const topSupplier = getMostFrequent('supplier');

  // Stats Data - Updated Label
  const stats = [
    { title: 'Total Documents', value: totalDocs, icon: FileText, color: 'primary' },
    { title: 'Verified Documents', value: verifiedCount, icon: CheckCircle, color: 'verified' },
    { title: 'Pending Verification', value: pendingCount, icon: Clock, color: 'pending' },
    { title: 'Flagged Documents', value: flaggedCount, icon: AlertTriangle, color: 'flagged' }, // Changed Label
    { title: 'Anchored on Chain', value: anchoredCount, icon: Link, color: 'accent' },
  ];

  return (
    <div className="min-h-screen bg-app-bg">
      <Header user={user!} onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="flex pt-16">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <main className="flex-1 lg:ml-64 p-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-primary font-display">Supply Chain Reports & Analytics</h1>
              <p className="text-gray-500 text-sm mt-1">Monitor document flow and verification status.</p>
            </div>
            <div className="flex gap-2 mt-4 md:mt-0">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                <Download className="w-4 h-4" /> CSV
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors shadow-sm">
                <Download className="w-4 h-4" /> PDF
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            {stats.map((stat) => (
              <div key={stat.title} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-3">
                  <div className={`p-2 rounded-lg bg-${stat.color}/10`}>
                    <stat.icon className={`w-5 h-5 text-${stat.color}`} />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.title}</p>
              </div>
            ))}
          </div>

          {loading ? (
             <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-secondary" />
             </div>
          ) : (
            <>
              {/* Charts */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
                <div className="xl:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Line Chart Mockup */}
                  <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                      <TrendingUp className="w-5 h-5 text-secondary" />
                      <h3 className="font-semibold text-gray-900 text-sm">Documents Over Time</h3>
                    </div>
                    <div className="h-40 w-full bg-gradient-to-t from-secondary/10 to-transparent rounded-lg flex items-end justify-around p-2">
                      <div className="w-2 h-1/2 bg-secondary/30 rounded"></div>
                      <div className="w-2 h-1/3 bg-secondary/30 rounded"></div>
                      <div className="w-2 h-2/3 bg-secondary/30 rounded"></div>
                      <div className="w-2 h-1/4 bg-secondary/30 rounded"></div>
                      <div className="w-2 h-3/4 bg-secondary rounded"></div>
                    </div>
                  </div>

                  {/* Pie Chart Mockup */}
                  <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                      <PieIcon className="w-5 h-5 text-secondary" />
                      <h3 className="font-semibold text-gray-900 text-sm">Document Types</h3>
                    </div>
                    <div className="flex items-center justify-center h-40">
                      <div className="w-24 h-24 rounded-full border-8 border-primary border-t-secondary border-r-accent border-b-pending flex items-center justify-center text-xs font-bold text-gray-500">
                        Dist
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Bar Chart */}
                  <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm col-span-1 md:col-span-2">
                    <div className="flex items-center gap-2 mb-4">
                      <BarChart2 className="w-5 h-5 text-secondary" />
                      <h3 className="font-semibold text-gray-900 text-sm">Verification Status</h3>
                    </div>
                    <div className="flex items-end justify-around h-32 border-l border-b border-gray-100">
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-10 bg-verified rounded-t transition-all" style={{ height: totalDocs ? `${(verifiedCount / totalDocs) * 100}%` : '0%', minHeight: '4px' }}></div>
                        <span className="text-xs text-gray-500">Verified</span>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-10 bg-pending rounded-t transition-all" style={{ height: totalDocs ? `${(pendingCount / totalDocs) * 100}%` : '0%', minHeight: '4px' }}></div>
                        <span className="text-xs text-gray-500">Pending</span>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-10 bg-flagged rounded-t transition-all" style={{ height: totalDocs ? `${(flaggedCount / totalDocs) * 100}%` : '0%', minHeight: '4px' }}></div>
                        <span className="text-xs text-gray-500">Flagged</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side Insights */}
                <div className="xl:col-span-1 space-y-6">
                  <div className="bg-gradient-to-br from-primary to-primary-dark rounded-xl shadow-sm p-6 text-white">
                    <h3 className="font-semibold text-lg mb-4">System Insights</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between border-b border-white/10 pb-2">
                        <span className="text-xs text-white/70">Most Uploaded</span>
                        <span className="text-sm font-semibold">{mostUploaded}</span>
                      </div>
                      <div className="flex justify-between border-b border-white/10 pb-2">
                        <span className="text-xs text-white/70">Top Supplier</span>
                        <span className="text-sm font-semibold">{topSupplier}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-white/70">Peak Day</span>
                        <span className="text-sm font-semibold">{getPeakDay()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detailed Activity Table */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-900">Detailed Activity</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left text-xs font-semibold text-gray-500 uppercase px-5 py-3">ID</th>
                        <th className="text-left text-xs font-semibold text-gray-500 uppercase px-5 py-3">Type</th>
                        <th className="text-left text-xs font-semibold text-gray-500 uppercase px-5 py-3">Supplier</th>
                        <th className="text-left text-xs font-semibold text-gray-500 uppercase px-5 py-3">Blockchain Tx</th>
                        <th className="text-left text-xs font-semibold text-gray-500 uppercase px-5 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {documents.slice(0, 5).map((row) => (
                        <tr key={row.id} className="hover:bg-gray-50">
                          <td className="px-5 py-3 font-mono text-sm text-primary">{row.doc_id}</td>
                          <td className="px-5 py-3 text-sm text-gray-600">{row.type}</td>
                          <td className="px-5 py-3 text-sm text-gray-500">{row.supplier || 'N/A'}</td>
                          <td className="px-5 py-3 text-sm text-gray-500">
                            {row.blockchain_records && row.blockchain_records.length > 0 ? (
                              <span className="font-mono text-xs text-secondary">
                                {row.blockchain_records[0].tx_hash.substring(0, 12)}...
                              </span>
                            ) : (
                              <span className="text-xs text-gray-400 italic">Unanchored</span>
                            )}
                          </td>
                          <td className="px-5 py-3">
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              row.status === 'Verified' ? 'bg-verified/10 text-verified' : 
                              row.status === 'Flagged' ? 'bg-flagged/10 text-flagged' : 
                              'bg-pending/10 text-pending'}`}>
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Reports;