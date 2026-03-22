/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import { FileText, CheckCircle, Clock, XCircle, Search, Eye, Download, Upload, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';

// Define shape of a Document
interface Document {
  id: string;
  doc_id: string;
  title: string;
  type: string;
  supplier: string;
  receiver: string;
  status: string;
  hash: string;
  created_at: string;
  file_url: string;
}

const DocumentRecords: React.FC = () => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All Types');
  const [filterStatus, setFilterStatus] = useState('All Status');

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter logic for Search, Type, and Status
  const filteredDocs = documents.filter(doc => {
    const matchesSearch = 
      doc.doc_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.title?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    
    const matchesType = filterType === 'All Types' || doc.type === filterType;
    const matchesStatus = filterStatus === 'All Status' || doc.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  // Calculate Stats
  const stats = [
    { title: 'Total Documents', value: documents.length, icon: FileText, color: 'primary' },
    { title: 'Verified', value: documents.filter(d => d.status === 'Verified').length, icon: CheckCircle, color: 'verified' },
    { title: 'Pending', value: documents.filter(d => d.status === 'Pending').length, icon: Clock, color: 'pending' },
    { title: 'Flagged', value: documents.filter(d => d.status === 'Flagged').length, icon: AlertCircle, color: 'flagged' },
  ];

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
          
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-primary font-display">Supply Chain Documents</h1>
              <p className="text-gray-500 text-sm mt-1">Manage and verify uploaded trade documents.</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Link 
                to="/upload" 
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors shadow-sm font-medium text-sm"
              >
                <Upload className="w-4 h-4" />
                Upload New
              </Link>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {stats.map((stat) => (
              <div key={stat.title} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
                <div className={`p-3 rounded-lg bg-${stat.color}/10`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}`} />
                </div>
                <div>
                  <p className="text-xs text-gray-500">{stat.title}</p>
                  <p className="font-bold text-gray-900 text-lg">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search by ID or Title..." 
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div>
                <select 
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                >
                  <option>All Types</option>
                  <option>Invoice</option>
                  <option>Delivery Note</option>
                  <option>Purchase Order</option>
                  <option>Receipt</option>
                </select>
              </div>
              <div>
                <select 
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                >
                  <option>All Status</option>
                  <option>Verified</option>
                  <option>Pending</option>
                  <option>Flagged</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase px-5 py-3">Document ID</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase px-5 py-3">Title</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase px-5 py-3 hidden md:table-cell">Type</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase px-5 py-3 hidden lg:table-cell">Supplier</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase px-5 py-3">Status</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="text-center py-10 text-gray-500">
                        Loading documents...
                      </td>
                    </tr>
                  ) : filteredDocs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-10 text-gray-400">
                        No documents found matching your criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredDocs.map((doc) => (
                      <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-4">
                          <span className="font-mono text-sm font-semibold text-primary">{doc.doc_id}</span>
                        </td>
                        <td className="px-5 py-4 text-sm text-gray-900 font-medium">{doc.title || 'Untitled'}</td>
                        <td className="px-5 py-4 hidden md:table-cell text-sm text-gray-600">{doc.type}</td>
                        <td className="px-5 py-4 hidden lg:table-cell text-sm text-gray-500">{doc.supplier || 'N/A'}</td>
                        <td className="px-5 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusClasses(doc.status)}`}>
                            {doc.status}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-1">
                            {doc.file_url && (
                              <>
                                <a href={doc.file_url} target="_blank" rel="noreferrer" className="p-1.5 hover:bg-gray-100 rounded-md text-gray-500 hover:text-secondary" title="View File">
                                  <Eye className="w-4 h-4" />
                                </a>
                                <a href={doc.file_url} download className="p-1.5 hover:bg-gray-100 rounded-md text-gray-500 hover:text-primary" title="Download">
                                  <Download className="w-4 h-4" />
                                </a>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer Stats */}
          <div className="flex justify-between items-center mt-4 text-sm text-gray-500 px-2">
            <span>Showing {filteredDocs.length} of {documents.length} results</span>
          </div>

        </main>
      </div>
    </div>
  );
};

export default DocumentRecords;