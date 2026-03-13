import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import { 
  FileText, CheckCircle, Clock, XCircle, Search, Eye, ShieldCheck, 
  Download, ChevronLeft, ChevronRight, X, Upload 
} from 'lucide-react';

const mockDocuments = [
  { id: 'INV-1023', type: 'Invoice', supplier: 'ABC Manufacturing', receiver: 'City Supermarket', date: '12 Mar 2026', status: 'Verified', validity: 'Valid', hash: '0x8F4A9D23C...' },
  { id: 'DN-55', type: 'Delivery Note', supplier: 'XYZ Logistics', receiver: 'Meru Retail', date: '11 Mar 2026', status: 'Pending', validity: 'Processing', hash: '0x7B2C8E11A...' },
  { id: 'PO-405', type: 'Purchase Order', supplier: 'Global Traders', receiver: 'Nairobi Depot', date: '10 Mar 2026', status: 'Verified', validity: 'Valid', hash: '0x1A3F5B99D...' },
  { id: 'INV-1022', type: 'Invoice', supplier: 'Tech Supplies Ltd', receiver: 'City Supermarket', date: '09 Mar 2026', status: 'Failed', validity: 'Tampered', hash: '0x9E7D1C22B...' },
  { id: 'RC-89', type: 'Receipt', supplier: 'Quick Services', receiver: 'Office Hub', date: '08 Mar 2026', status: 'Verified', validity: 'Valid', hash: '0x4D5A6B7C8...' },
];

const DocumentRecords: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<typeof mockDocuments[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const user = { name: 'Simon Kamau', role: 'Admin', initials: 'SK' };

  const getStatusClasses = (status: string) => {
    switch (status) {
      case 'Verified': return 'bg-verified/10 text-verified';
      case 'Pending': return 'bg-pending/10 text-pending';
      case 'Failed': return 'bg-flagged/10 text-flagged';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-app-bg">
      <Header user={user} onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      <div className="flex pt-16">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        <main className="flex-1 lg:ml-64 p-6">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-primary font-display">Supply Chain Document Records</h1>
              <p className="text-gray-500 text-sm mt-1">View and track all supply chain paperwork recorded in the system.</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Link to="/upload" className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors shadow-sm font-medium text-sm">
                <Upload className="w-4 h-4" /> Upload New Document
              </Link>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { title: 'Total Documents', value: '1,245', icon: FileText, color: 'primary' },
              { title: 'Verified Documents', value: '980', icon: CheckCircle, color: 'verified' },
              { title: 'Pending Verification', value: '210', icon: Clock, color: 'pending' },
              { title: 'Rejected / Invalid', value: '55', icon: XCircle, color: 'flagged' },
            ].map((stat) => (
              <div key={stat.title} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-lg bg-${stat.color}/10`}>
                    <stat.icon className={`w-5 h-5 text-${stat.color}`} />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.title}</p>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
              <div className="md:col-span-2 relative">
                <label className="block text-xs font-medium text-gray-500 mb-1">Search Documents</label>
                <Search className="absolute left-3 top-9 w-4 h-4 text-gray-400" />
                <input type="text" placeholder="Search by ID, Supplier..." className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Type</label>
                <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary">
                  <option>All Types</option><option>Invoice</option><option>Delivery Note</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Date</label>
                <input type="date" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
                <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary">
                  <option>All Status</option><option>Verified</option><option>Pending</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase px-5 py-3">Doc ID</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase px-5 py-3">Type</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase px-5 py-3 hidden lg:table-cell">Supplier</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase px-5 py-3 hidden md:table-cell">Receiver</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase px-5 py-3">Date</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase px-5 py-3">Status</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase px-5 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {mockDocuments.map((doc) => (
                    <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4 font-mono text-sm font-semibold text-primary">{doc.id}</td>
                      <td className="px-5 py-4 text-sm text-gray-700">{doc.type}</td>
                      <td className="px-5 py-4 hidden lg:table-cell text-sm text-gray-600">{doc.supplier}</td>
                      <td className="px-5 py-4 hidden md:table-cell text-sm text-gray-600">{doc.receiver}</td>
                      <td className="px-5 py-4 text-sm text-gray-500">{doc.date}</td>
                      <td className="px-5 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusClasses(doc.status)}`}>{doc.status}</span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1">
                          <button onClick={() => setSelectedDoc(doc)} className="p-1.5 hover:bg-gray-100 rounded-md text-gray-500 hover:text-primary transition-colors" title="View"><Eye className="w-4 h-4" /></button>
                          <button className="p-1.5 hover:bg-gray-100 rounded-md text-gray-500 hover:text-secondary transition-colors" title="Verify"><ShieldCheck className="w-4 h-4" /></button>
                          <button className="p-1.5 hover:bg-gray-100 rounded-md text-gray-500 hover:text-primary transition-colors" title="Download"><Download className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">Showing <span className="font-medium">1</span> to <span className="font-medium">5</span> of <span className="font-medium">1,245</span> results</p>
            <div className="flex items-center gap-1">
              <button className="p-2 rounded-md border border-gray-200 hover:bg-gray-50 text-gray-500 disabled:opacity-50"><ChevronLeft className="w-4 h-4" /></button>
              <button className="px-3 py-1.5 rounded-md bg-primary text-white text-sm font-medium">1</button>
              <button className="px-3 py-1.5 rounded-md hover:bg-gray-100 text-gray-600 text-sm font-medium">2</button>
              <button className="px-3 py-1.5 rounded-md hover:bg-gray-100 text-gray-600 text-sm font-medium">3</button>
              <button className="p-2 rounded-md border border-gray-200 hover:bg-gray-50 text-gray-500"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        </main>
      </div>

      {/* Side Panel */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSelectedDoc(null)}></div>
          <div className="absolute inset-y-0 right-0 max-w-md w-full bg-white shadow-xl flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900">Document Details</h3>
              <button onClick={() => setSelectedDoc(null)} className="p-1 hover:bg-gray-200 rounded-full"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Content details omitted for brevity, same as previous implementation */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center"><FileText className="w-6 h-6 text-primary" /></div>
                <div><h4 className="font-bold text-gray-900">{selectedDoc.id}</h4><p className="text-sm text-gray-500">{selectedDoc.type}</p></div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex gap-3">
              <button className="flex-1 px-4 py-2 bg-secondary text-white rounded-lg font-medium hover:bg-secondary-dark transition-colors flex items-center justify-center gap-2"><ShieldCheck className="w-4 h-4" /> Verify</button>
              <button className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"><Download className="w-4 h-4" /> Download</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentRecords;