import React, { useState } from 'react';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import { FileText, CheckCircle, Clock, AlertTriangle, Download, TrendingUp, PieChart as PieIcon, BarChart2 } from 'lucide-react';


const Reports: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const user = { name: 'Simon Kamau', role: 'Admin', initials: 'SK' };

  const reportData = [
    { id: 'INV-1023', type: 'Invoice', supplier: 'ABC Manufacturing', receiver: 'City Supermarket', date: '12 Mar 2026', status: 'Verified' },
    { id: 'DN-55', type: 'Delivery Note', supplier: 'XYZ Logistics', receiver: 'Meru Retail', date: '11 Mar 2026', status: 'Pending' },
  ];

  return (
    <div className="min-h-screen bg-app-bg">
      <Header user={user} onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
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
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"><Download className="w-4 h-4" /> CSV</button>
              <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors shadow-sm"><Download className="w-4 h-4" /> PDF</button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm"><div className="flex justify-between items-center mb-3"><div className="p-2 rounded-lg bg-primary/10"><FileText className="w-5 h-5 text-primary" /></div></div><p className="text-2xl font-bold text-gray-900">1,245</p><p className="text-xs text-gray-500 mt-1">Total Documents</p></div>
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm"><div className="flex justify-between items-center mb-3"><div className="p-2 rounded-lg bg-verified/10"><CheckCircle className="w-5 h-5 text-verified" /></div></div><p className="text-2xl font-bold text-gray-900">980</p><p className="text-xs text-gray-500 mt-1">Verified Documents</p></div>
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm"><div className="flex justify-between items-center mb-3"><div className="p-2 rounded-lg bg-pending/10"><Clock className="w-5 h-5 text-pending" /></div></div><p className="text-2xl font-bold text-gray-900">210</p><p className="text-xs text-gray-500 mt-1">Pending Verification</p></div>
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm"><div className="flex justify-between items-center mb-3"><div className="p-2 rounded-lg bg-flagged/10"><AlertTriangle className="w-5 h-5 text-flagged" /></div></div><p className="text-2xl font-bold text-gray-900">12</p><p className="text-xs text-gray-500 mt-1">Fraud Attempts Detected</p></div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
            <div className="xl:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Line Chart Mockup */}
              <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2 mb-4"><TrendingUp className="w-5 h-5 text-secondary" /><h3 className="font-semibold text-gray-900 text-sm">Documents Over Time</h3></div>
                <div className="h-40 w-full bg-gradient-to-t from-secondary/10 to-transparent rounded-lg flex items-end justify-around p-2">
                  <div className="w-2 h-1/2 bg-secondary/30 rounded"></div><div className="w-2 h-1/3 bg-secondary/30 rounded"></div><div className="w-2 h-2/3 bg-secondary/30 rounded"></div><div className="w-2 h-1/4 bg-secondary/30 rounded"></div><div className="w-2 h-3/4 bg-secondary rounded"></div>
                </div>
              </div>
              {/* Pie Chart Mockup */}
              <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2 mb-4"><PieIcon className="w-5 h-5 text-secondary" /><h3 className="font-semibold text-gray-900 text-sm">Document Types</h3></div>
                <div className="flex items-center justify-center h-40">
                   <div className="w-24 h-24 rounded-full border-8 border-primary border-t-secondary border-r-accent border-b-pending flex items-center justify-center text-xs font-bold text-gray-500">Dist</div>
                </div>
              </div>
              {/* Bar Chart Mockup */}
              <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm col-span-1 md:col-span-2">
                <div className="flex items-center gap-2 mb-4"><BarChart2 className="w-5 h-5 text-secondary" /><h3 className="font-semibold text-gray-900 text-sm">Verification Status</h3></div>
                <div className="flex items-end justify-around h-32 border-l border-b border-gray-100">
                  <div className="flex flex-col items-center gap-1"><div className="w-10 h-20 bg-verified rounded-t"></div><span className="text-xs text-gray-500">Verified</span></div>
                  <div className="flex flex-col items-center gap-1"><div className="w-10 h-10 bg-pending rounded-t"></div><span className="text-xs text-gray-500">Pending</span></div>
                  <div className="flex flex-col items-center gap-1"><div className="w-10 h-5 bg-flagged rounded-t"></div><span className="text-xs text-gray-500">Failed</span></div>
                </div>
              </div>
            </div>

            {/* Right Side */}
            <div className="xl:col-span-1 space-y-6">
              <div className="bg-gradient-to-br from-primary to-primary-dark rounded-xl shadow-sm p-6 text-white">
                <h3 className="font-semibold text-lg mb-4">System Insights</h3>
                <div className="space-y-4">
                  <div className="flex justify-between border-b border-white/10 pb-2"><span className="text-xs text-white/70">Most Uploaded</span><span className="text-sm font-semibold">Invoices</span></div>
                  <div className="flex justify-between border-b border-white/10 pb-2"><span className="text-xs text-white/70">Top Supplier</span><span className="text-sm font-semibold">ABC Ltd</span></div>
                  <div className="flex justify-between"><span className="text-xs text-white/70">Peak Day</span><span className="text-sm font-semibold">Monday</span></div>
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100"><h3 className="font-semibold text-gray-900">Detailed Activity</h3></div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50"><tr><th className="text-left text-xs font-semibold text-gray-500 uppercase px-5 py-3">ID</th><th className="text-left text-xs font-semibold text-gray-500 uppercase px-5 py-3">Type</th><th className="text-left text-xs font-semibold text-gray-500 uppercase px-5 py-3">Supplier</th><th className="text-left text-xs font-semibold text-gray-500 uppercase px-5 py-3">Status</th></tr></thead>
                <tbody className="divide-y divide-gray-100">
                  {reportData.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50">
                      <td className="px-5 py-3 font-mono text-sm text-primary">{row.id}</td>
                      <td className="px-5 py-3 text-sm text-gray-600">{row.type}</td>
                      <td className="px-5 py-3 text-sm text-gray-500">{row.supplier}</td>
                      <td className="px-5 py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${row.status === 'Verified' ? 'bg-verified/10 text-verified' : 'bg-pending/10 text-pending'}`}>{row.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Reports;