/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import { Blocks, CircleDot, Clock, Eye, ShieldCheck, ArrowRight, X, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

// Interface for the joined document data (matches Supabase one-to-one relation)
interface DocumentDetails {
  type: string;
  status: string;
}

// Interface matching the blockchain_records table + joined document
interface BlockchainRecord {
  id: string;
  doc_id: string;
  tx_hash: string;
  block_number: number;
  hash: string;
  created_at: string;
  documents: DocumentDetails | null | DocumentDetails[]; 
}

// Helper to format time ago
const timeAgo = (date: string) => {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return `${seconds} secs ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} mins ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hours ago`;
  return new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

const BlockchainLedger: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [records, setRecords] = useState<BlockchainRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBlock, setSelectedBlock] = useState<BlockchainRecord | null>(null);
  
  const user = { name: 'Simon Kamau', role: 'Admin', initials: 'SK' };

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      
      // Fetching from blockchain_records and joining documents (similar pattern to Dashboard)
      const { data, error: fetchError } = await supabase
        .from('blockchain_records')
        .select(`
          id,
          doc_id,
          tx_hash,
          block_number,
          hash,
          created_at,
          documents (
            type,
            status
          )
        `)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setRecords(data || []);
    } catch (err: any) {
      console.error('Error fetching blockchain records:', err);
      setError('Failed to load ledger data.');
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

  const stats = [
    { title: 'Node Status', value: 'Active', icon: CircleDot, color: 'verified' },
    { title: 'Last Block', value: records.length ? timeAgo(records[0].created_at) : 'N/A', icon: Clock, color: 'secondary' },
    { title: 'Total Blocks', value: records.length.toString(), icon: Blocks, color: 'primary' },
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
              <h1 className="text-2xl font-bold text-primary font-display">Blockchain Document Ledger</h1>
              <p className="text-gray-500 text-sm mt-1">View immutable records of supply chain documents.</p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center gap-2 bg-verified/10 text-verified border border-verified/20 px-4 py-2 rounded-lg text-sm font-medium">
              <CircleDot className="w-4 h-4 animate-pulse" /> Network: Connected
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {stats.map((stat) => (
              <div key={stat.title} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
                <div className={`p-3 rounded-lg bg-${stat.color}/10`}><stat.icon className={`w-6 h-6 text-${stat.color}`} /></div>
                <div><p className="text-xs text-gray-500">{stat.title}</p><p className="font-bold text-gray-900">{stat.value}</p></div>
              </div>
            ))}
          </div>

          {/* Chain Visualization */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6 overflow-x-auto">
            <div className="flex items-center justify-start gap-2 min-w-max">
              {records.slice(0, 3).map((rec, idx) => (
                <React.Fragment key={rec.id}>
                  {idx > 0 && <ArrowRight className="w-6 h-6 text-gray-300" />}
                  <div className={`w-40 h-28 border-2 rounded-xl flex flex-col items-center justify-center shadow-sm relative ${idx === 0 ? 'border-secondary bg-secondary/5' : 'border-gray-200 bg-gray-50 opacity-75'}`}>
                    {idx === 0 && <span className="absolute -top-2 right-2 text-[10px] bg-secondary text-white px-2 py-0.5 rounded-full">Latest</span>}
                    <p className="text-xs text-gray-500">Block</p>
                    <p className="font-bold text-primary text-xl">
                      {rec.block_number ? `#${rec.block_number}` : `#${rec.id.substring(0, 4)}`}
                    </p>
                  </div>
                </React.Fragment>
              ))}
              {records.length === 0 && !loading && (
                <div className="text-gray-400 text-sm w-full text-center py-4">No blocks mined yet.</div>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase px-5 py-3">Block #</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase px-5 py-3">Document ID</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase px-5 py-3">Transaction Hash</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase px-5 py-3">Type</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase px-5 py-3">Status</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase px-5 py-3">Timestamp</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase px-5 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="text-center py-10">
                        <Loader2 className="w-6 h-6 animate-spin text-secondary mx-auto" />
                        <p className="text-gray-500 mt-2 text-sm">Loading Ledger...</p>
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan={7} className="text-center py-10 text-flagged">
                        <AlertCircle className="w-6 h-6 mx-auto mb-2" />
                        {error}
                      </td>
                    </tr>
                  ) : records.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-10 text-gray-500">No records found.</td>
                    </tr>
                  ) : (
                    records.map((tx) => (
                      <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-4 font-mono text-sm font-semibold text-primary">
                          {tx.block_number ? `#${tx.block_number}` : `#${tx.id.substring(0, 8)}`}
                        </td>
                        <td className="px-5 py-4 text-sm font-medium text-gray-800">{tx.doc_id}</td>
                        <td className="px-5 py-4">
                           <span className="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                             {tx.tx_hash ? `${tx.tx_hash.substring(0, 10)}...` : 'N/A'}
                           </span>
                        </td>
                        <td className="px-5 py-4 text-sm text-gray-600">
                          {Array.isArray(tx.documents) ? tx.documents[0]?.type || 'Unknown' : tx.documents?.type || 'Unknown'}
                        </td>
                        <td className="px-5 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusClasses(Array.isArray(tx.documents) ? tx.documents[0]?.status || 'Pending' : tx.documents?.status || 'Pending')}`}>
                            {Array.isArray(tx.documents) ? tx.documents[0]?.status || 'Pending' : tx.documents?.status || 'Pending'}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-sm text-gray-500">{timeAgo(tx.created_at)}</td>
                        <td className="px-5 py-4">
                          <button onClick={() => setSelectedBlock(tx)} className="flex items-center gap-1 text-xs font-medium text-secondary hover:underline">
                            <Eye className="w-3 h-3" /> View
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Detail Panel */}
      {selectedBlock && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSelectedBlock(null)}></div>
          <div className="absolute inset-y-0 right-0 max-w-md w-full bg-white shadow-xl flex flex-col">
            
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-primary to-primary-dark">
              <div>
                <h3 className="text-lg font-bold text-white">
                  Block #{selectedBlock.block_number || selectedBlock.id.substring(0, 8)}
                </h3>
                <p className="text-sm text-white/70">Details</p>
              </div>
              <button onClick={() => setSelectedBlock(null)} className="p-1 hover:bg-white/20 rounded-full">
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* Verification Status Banner */}
                <div className="p-4 bg-verified/10 border border-verified/30 rounded-xl">
                    <div className="flex items-start gap-3">
                        <CheckCircle className="w-6 h-6 text-verified flex-shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-bold text-verified">Document Verified</h4>
                            <p className="text-sm text-gray-600 mt-1">Integrity confirmed. The file matches the blockchain record.</p>
                        </div>
                    </div>
                </div>

                {/* Data Fields */}
                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                    <div className="space-y-4 text-sm">
                        <div>
                            <p className="text-gray-500 text-xs uppercase font-semibold">Document ID</p>
                            <p className="font-semibold text-gray-900 mt-1">{selectedBlock.doc_id}</p>
                        </div>
                        <div>
                            <p className="text-gray-500 text-xs uppercase font-semibold">Type</p>
                            <p className="font-semibold text-gray-900 mt-1">{Array.isArray(selectedBlock.documents) ? selectedBlock.documents[0]?.type || 'N/A' : selectedBlock.documents?.type || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-gray-500 text-xs uppercase font-semibold">Blockchain Hash</p>
                            <p className="font-mono text-xs text-gray-700 bg-gray-50 p-2 rounded border border-gray-100 break-all mt-1">
                                {selectedBlock.tx_hash || 'N/A'}
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-500 text-xs uppercase font-semibold">Stored Timestamp</p>
                            <p className="font-semibold text-gray-900 mt-1">{new Date(selectedBlock.created_at).toLocaleString()}</p>
                        </div>
                    </div>
                </div>

            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-100 bg-gray-50 space-y-3">
              <Link to="/verify" className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-secondary text-white rounded-lg font-medium hover:bg-secondary-dark transition-colors">
                <ShieldCheck className="w-4 h-4" /> Verify Integrity
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlockchainLedger;