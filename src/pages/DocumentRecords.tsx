/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import { FileText, CheckCircle, Clock, XCircle, Search, Eye, ShieldCheck, Download, Upload, ChevronLeft, ChevronRight } from 'lucide-react';
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

  // Fetch Documents from Supabase
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

  // Filter documents based on search
  const filteredDocs = documents.filter(doc => 
    doc.doc_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              <h1 className="text-2xl font-bold text-primary font-display">Supply Chain Document Records</h1>
              <p className="text-gray-500 text-sm mt-1">Real-time data from Supabase.</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Link 
                to="/upload" 
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors shadow-sm font-medium text-sm"
              >
                <Upload className="w-4 h-4" />
                Upload New Document
              </Link>
            </div>
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
                <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary">
                  <option>All Types</option>
                  <option>Invoice</option>
                  <option>Delivery Note</option>
                </select>
              </div>
              <div>
                <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary">
                  <option>All Status</option>
                  <option>Verified</option>
                  <option>Pending</option>
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
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase px-5 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="text-center py-10 text-gray-500">
                        Loading data from blockchain...
                      </td>
                    </tr>
                  ) : filteredDocs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-10 text-gray-400">
                        No documents found. Upload one to get started.
                      </td>
                    </tr>
                  ) : (
                    filteredDocs.map((doc) => (
                      <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-4">
                          <span className="font-mono text-sm font-semibold text-primary">{doc.doc_id}</span>
                        </td>
                        <td className="px-5 py-4 text-sm text-gray-900 font-medium">{doc.title || 'N/A'}</td>
                        <td className="px-5 py-4 hidden md:table-cell text-sm text-gray-600">{doc.type}</td>
                        <td className="px-5 py-4 hidden lg:table-cell text-sm text-gray-500">{doc.supplier}</td>
                        <td className="px-5 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusClasses(doc.status)}`}>
                            {doc.status}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1">
                            <a href={doc.file_url} target="_blank" rel="noreferrer" className="p-1.5 hover:bg-gray-100 rounded-md text-gray-500 hover:text-secondary" title="View File">
                              <Eye className="w-4 h-4" />
                            </a>
                            <a href={doc.file_url} download className="p-1.5 hover:bg-gray-100 rounded-md text-gray-500 hover:text-primary" title="Download">
                              <Download className="w-4 h-4" />
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination Placeholder */}
          <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
            <span>Showing {filteredDocs.length} results</span>
          </div>

        </main>
      </div>
    </div>
  );
};

export default DocumentRecords;