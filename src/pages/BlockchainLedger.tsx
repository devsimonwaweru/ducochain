import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import { Blocks, CircleDot, Clock, Eye, ShieldCheck, FileText, Hash, ArrowRight, X } from 'lucide-react';

const mockTransactions = [
  { block: 4231, docId: 'INV-1023', type: 'Invoice', hash: '0x8F4A9D23C...', timestamp: '13 Mar 2026', status: 'Verified', owner: 'Supplier' },
  { block: 4230, docId: 'DN-55', type: 'Delivery Note', hash: '0x7B2C8E11A...', timestamp: '13 Mar 2026', status: 'Verified', owner: 'Logistics' },
  { block: 4229, docId: 'PO-405', type: 'Purchase Order', hash: '0x1A3F5B99D...', timestamp: '12 Mar 2026', status: 'Pending', owner: 'Retailer' },
  { block: 4228, docId: 'INV-1022', type: 'Invoice', hash: '0x9E7D1C22B...', timestamp: '11 Mar 2026', status: 'Failed', owner: 'Supplier' },
];

const BlockchainLedger: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState<typeof mockTransactions[0] | null>(null);
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
             {[
              { title: 'Node Status', value: 'Active', icon: CircleDot, color: 'verified' },
              { title: 'Last Block', value: '2 mins ago', icon: Clock, color: 'secondary' },
              { title: 'Total Blocks', value: '4,325', icon: Blocks, color: 'primary' },
            ].map((stat) => (
              <div key={stat.title} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
                <div className={`p-3 rounded-lg bg-${stat.color}/10`}><stat.icon className={`w-6 h-6 text-${stat.color}`} /></div>
                <div><p className="text-xs text-gray-500">{stat.title}</p><p className="font-bold text-gray-900">{stat.value}</p></div>
              </div>
            ))}
          </div>

          {/* Chain Visualization */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6 overflow-x-auto">
            <div className="flex items-center justify-start gap-2 min-w-max">
              <div className="w-32 h-24 border border-gray-200 rounded-lg flex flex-col items-center justify-center bg-gray-50 opacity-75"><p className="text-xs text-gray-500">Block</p><p className="font-bold text-gray-700">#4229</p></div>
              <ArrowRight className="w-6 h-6 text-gray-300" />
              <div className="w-32 h-24 border border-gray-200 rounded-lg flex flex-col items-center justify-center bg-gray-50 opacity-75"><p className="text-xs text-gray-500">Block</p><p className="font-bold text-gray-700">#4230</p></div>
              <ArrowRight className="w-6 h-6 text-secondary" />
              <div className="w-40 h-28 border-2 border-secondary rounded-xl flex flex-col items-center justify-center bg-secondary/5 shadow-sm relative">
                <span className="absolute -top-2 right-2 text-[10px] bg-secondary text-white px-2 py-0.5 rounded-full">Latest</span>
                <p className="text-xs text-secondary">Current Block</p><p className="font-bold text-primary text-xl">#4231</p>
              </div>
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
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase px-5 py-3">Hash</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase px-5 py-3">Status</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase px-5 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {mockTransactions.map((tx) => (
                    <tr key={tx.block} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4 font-mono text-sm font-semibold text-primary">#{tx.block}</td>
                      <td className="px-5 py-4 text-sm font-medium text-gray-800">{tx.docId}</td>
                      <td className="px-5 py-4 font-mono text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{tx.hash}</td>
                      <td className="px-5 py-4"><span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusClasses(tx.status)}`}>{tx.status}</span></td>
                      <td className="px-5 py-4"><button onClick={() => setSelectedBlock(tx)} className="flex items-center gap-1 text-xs font-medium text-secondary hover:underline"><Eye className="w-3 h-3" /> View</button></td>
                    </tr>
                  ))}
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
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-primary to-primary-dark">
              <div><h3 className="text-lg font-bold text-white">Block #{selectedBlock.block}</h3><p className="text-sm text-white/70">Details</p></div>
              <button onClick={() => setSelectedBlock(null)} className="p-1 hover:bg-white/20 rounded-full"><X className="w-5 h-5 text-white" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="flex justify-center"><span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${getStatusClasses(selectedBlock.status)}`}>{selectedBlock.status}</span></div>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-3"><FileText className="w-4 h-4 text-gray-400" /><div><p className="text-xs text-gray-500">Document ID</p><p className="text-sm font-semibold text-gray-800">{selectedBlock.docId}</p></div></div>
                <div className="flex items-center gap-3"><Hash className="w-4 h-4 text-gray-400" /><div><p className="text-xs text-gray-500">Hash</p><p className="text-xs font-mono text-gray-800 break-all">{selectedBlock.hash}</p></div></div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 bg-gray-50 space-y-3">
              <Link to="/verify" className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-secondary text-white rounded-lg font-medium hover:bg-secondary-dark transition-colors"><ShieldCheck className="w-4 h-4" /> Verify Integrity</Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlockchainLedger;