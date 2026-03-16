import React, { useState } from 'react';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import { AlertTriangle, Info, UploadCloud, Search, Hash, CheckCircle, XCircle } from 'lucide-react';



const verificationHistory = [
  { id: 'INV-1023', date: '13 Mar 2026', result: 'Verified', user: 'Admin' },
  { id: 'DN-554', date: '13 Mar 2026', result: 'Failed', user: 'Supplier' },
  { id: 'PO-101', date: '12 Mar 2026', result: 'Verified', user: 'Auditor' },
];

const getMockResult = (searchTerm: string) => {
  if (searchTerm.includes('INV')) {
    return {
      status: 'verified', title: 'Document Verified', message: 'This document matches the blockchain record.',
      details: { docName: 'Invoice #1023', type: 'Invoice', supplier: 'ABC Manufacturing', receiver: 'City Supermarket', uploadDate: '12 March 2026', hash: '0x8F4A9D23C...', timestamp: '12 Mar 2026' }
    };
  } else if (searchTerm.includes('DN')) {
    return { status: 'tampered', title: 'Document Integrity Failed', message: 'Possible tampering detected.', details: null };
  } else {
    return { status: 'not_found', title: 'Document Not Found', message: 'Not recorded on blockchain.', details: null };
  }
};

const VerifyDocument: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'upload' | 'id'>('id');
  const [file, setFile] = useState<File | null>(null);
  const [docId, setDocId] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<ReturnType<typeof getMockResult> | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const user = { name: 'Simon Kamau', role: 'Admin', initials: 'SK' };

  const handleVerify = () => {
    if (!file && !docId) return;
    setIsVerifying(true); setResult(null);
    setTimeout(() => {
      const searchTerm = file ? file.name : docId;
      setResult(getMockResult(searchTerm));
      setIsVerifying(false);
    }, 1500);
  };

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files[0]) setFile(e.dataTransfer.files[0]); };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'verified': return { bg: 'bg-verified/10', border: 'border-verified/30', text: 'text-verified', icon: CheckCircle };
      case 'tampered': return { bg: 'bg-flagged/10', border: 'border-flagged/30', text: 'text-flagged', icon: XCircle };
      default: return { bg: 'bg-pending/10', border: 'border-pending/30', text: 'text-pending', icon: AlertTriangle };
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
              <h1 className="text-2xl font-bold text-primary font-display">Verify Supply Chain Document</h1>
              <p className="text-gray-500 text-sm mt-1">Check document authenticity using blockchain verification.</p>
            </div>
            <div className="mt-4 md:mt-0 bg-primary/5 text-primary border border-primary/20 px-4 py-2 rounded-lg text-xs font-medium flex items-center gap-2">
              <Info className="w-4 h-4" /> Method: Document Hash Matching
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 space-y-6">
              {/* Input Section */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Verification Method</h2>
                <div className="flex border-b border-gray-200 mb-6">
                  <button onClick={() => { setActiveTab('id'); setFile(null); }} className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'id' ? 'border-secondary text-secondary' : 'border-transparent text-gray-500'}`}>Enter Document ID</button>
                  <button onClick={() => { setActiveTab('upload'); setDocId(''); }} className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'upload' ? 'border-secondary text-secondary' : 'border-transparent text-gray-500'}`}>Upload Document</button>
                </div>

                {activeTab === 'upload' ? (
                  <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${isDragging ? 'border-secondary bg-secondary/5' : 'border-gray-200 bg-gray-50/50'}`} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} onClick={() => document.getElementById('fileInput')?.click()}>
                    {file ? <p className="font-medium text-secondary">{file.name}</p> : <><UploadCloud className="w-10 h-10 mx-auto text-gray-400 mb-2" /><p className="font-medium text-gray-700">Drag & Drop Document Here</p><p className="text-sm text-gray-400 mt-1">or <span className="text-secondary font-medium">click to browse</span></p></>}
                    <input id="fileInput" type="file" className="hidden" onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])} />
                  </div>
                ) : (
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="text" placeholder="e.g. INV-1023" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary" value={docId} onChange={(e) => setDocId(e.target.value)} />
                  </div>
                )}

                <button onClick={handleVerify} disabled={(!file && !docId) || isVerifying} className="mt-6 w-full bg-secondary hover:bg-secondary-dark text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                  {isVerifying ? 'Verifying...' : <><Search className="w-5 h-5" /> Verify Document</>}
                </button>
              </div>

              {/* Result Section */}
              {result && (
                <div className="animate-fade-in space-y-6">
                  <div className={`rounded-xl border p-6 ${getStatusStyles(result.status).bg} ${getStatusStyles(result.status).border}`}>
                    <div className="flex items-start gap-4">
                      {React.createElement(getStatusStyles(result.status).icon, { className: `w-8 h-8 ${getStatusStyles(result.status).text}` })}
                      <div>
                        <h3 className={`font-bold text-lg ${getStatusStyles(result.status).text}`}>{result.title}</h3>
                        <p className="text-gray-600 text-sm mt-1">{result.message}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar History */}
            <div className="xl:col-span-1">
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden sticky top-20">
                <div className="p-4 border-b border-gray-100 bg-gray-50"><h3 className="font-semibold text-gray-900">Verification History</h3></div>
                <div className="divide-y divide-gray-100">
                  {verificationHistory.map((item) => (
                    <div key={item.id} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-mono text-sm font-semibold text-primary">{item.id}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${item.result === 'Verified' ? 'bg-verified/10 text-verified' : 'bg-flagged/10 text-flagged'}`}>{item.result}</span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500"><span>{item.date}</span><span>by {item.user}</span></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default VerifyDocument;