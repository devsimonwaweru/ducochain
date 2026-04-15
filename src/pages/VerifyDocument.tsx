/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import { AlertTriangle, Info, UploadCloud, Search, Hash, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { generateFileHash } from '../utils/hash';
import { useAuth } from '../context/AuthContext';

const VerifyDocument: React.FC = () => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files[0]) setFile(e.dataTransfer.files[0]);
    setResult(null);
  };

  const handleVerify = async () => {
    if (!file) return;
    
    setIsVerifying(true);
    setResult(null);

    try {
      // 1. Generate Hash of the uploaded file
      const generatedHash = await generateFileHash(file);

      // 2. Query Supabase for this hash
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('hash', generatedHash)
        .single();

      if (error || !data) {
        // 3. NOT FOUND: Automatically Log as Fraud/Flagged Attempt
        
        // Create a temporary ID for the flagged record
        const flaggedDocId = `FRAUD-${Date.now().toString(36).toUpperCase()}`;

        // Insert into documents table as 'Flagged'
        await supabase.from('documents').insert([
          {
            doc_id: flaggedDocId,
            hash: generatedHash,
            type: 'Unknown',
            supplier: 'Unknown',
            status: 'Flagged', // Automatically flagged
            title: `Fraud Attempt: ${file.name}`
          }
        ]);

        setResult({
          status: 'flagged',
          title: 'Fraud Attempt Detected',
          message: 'This document does not match any record in the blockchain ledger. The attempt has been logged.',
          icon: AlertTriangle,
          color: 'flagged'
        });
      } else {
        // Found - Verified
        setResult({
          status: 'verified',
          title: 'Document Verified',
          message: 'Integrity confirmed. The file matches the blockchain record.',
          details: data,
          icon: CheckCircle,
          color: 'verified'
        });
      }
    } catch (err) {
      console.error(err);
      setResult({
        status: 'error',
        title: 'Verification Failed',
        message: 'An error occurred during verification.',
        icon: XCircle,
        color: 'flagged'
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const getStatusStyles = (color: string) => {
    switch (color) {
      case 'verified': return { bg: 'bg-verified/10', border: 'border-verified/30', text: 'text-verified' };
      case 'flagged': return { bg: 'bg-flagged/10', border: 'border-flagged/30', text: 'text-flagged' };
      default: return { bg: 'bg-pending/10', border: 'border-pending/30', text: 'text-pending' };
    }
  };

  return (
    <div className="min-h-screen bg-app-bg">
      <Header user={user!} onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="flex pt-16">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <main className="flex-1 lg:ml-64 p-6">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-primary font-display">Verify Document</h1>
              <p className="text-gray-500 text-sm mt-1">Check document authenticity using SHA-256 Hash.</p>
            </div>
            <div className="mt-4 md:mt-0 bg-primary/5 text-primary border border-primary/20 px-4 py-2 rounded-lg text-xs font-medium flex items-center gap-2">
              <Info className="w-4 h-4" /> Real-time Verification
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 space-y-6">
              
              {/* Upload Section */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Document to Verify</h2>
                
                <div 
                  className={`border-2 border-dashed rounded-xl p-10 text-center transition-colors cursor-pointer
                    ${isDragging ? 'border-secondary bg-secondary/5' : 'border-gray-200 hover:border-gray-300 bg-gray-50/50'}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('verifyFileInput')?.click()}
                >
                  {file ? (
                    <div className="flex items-center justify-center gap-3 text-secondary">
                      <Hash className="w-8 h-8" />
                      <div className="text-left">
                        <p className="font-medium">{file.name}</p>
                        <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <UploadCloud className="w-10 h-10 mx-auto text-gray-400 mb-2" />
                      <p className="font-medium text-gray-700">Drag & Drop Document Here</p>
                      <p className="text-sm text-gray-400 mt-1">or <span className="text-secondary font-medium">click to browse</span></p>
                    </>
                  )}
                  <input id="verifyFileInput" type="file" className="hidden" onChange={(e) => { if(e.target.files?.[0]) setFile(e.target.files[0]); setResult(null); }} />
                </div>

                <button 
                  onClick={handleVerify}
                  disabled={!file || isVerifying}
                  className="mt-6 w-full bg-secondary hover:bg-secondary-dark text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" /> Verifying Hash...
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5" /> Verify Document
                    </>
                  )}
                </button>
              </div>

              {/* Result Section */}
              {result && (
                <div className={`rounded-xl border p-6 ${getStatusStyles(result.color).bg} ${getStatusStyles(result.color).border} animate-fade-in`}>
                  <div className="flex items-start gap-4">
                    <result.icon className={`w-8 h-8 ${getStatusStyles(result.color).text}`} />
                    <div>
                      <h3 className={`font-bold text-lg ${getStatusStyles(result.color).text}`}>{result.title}</h3>
                      <p className="text-gray-600 text-sm mt-1">{result.message}</p>
                    </div>
                  </div>

                  {/* Show details if verified */}
                  {result.status === 'verified' && result.details && (
                    <div className="mt-6 bg-white rounded-lg p-4 border border-gray-100">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Document ID</p>
                          <p className="font-mono font-semibold text-gray-900">{result.details.doc_id}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Type</p>
                          <p className="font-semibold text-gray-900">{result.details.type}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-gray-500">Blockchain Hash</p>
                          <p className="font-mono text-xs text-gray-600 break-all">{result.details.hash}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-gray-500">Stored Timestamp</p>
                          <p className="font-semibold text-gray-900">{new Date(result.details.created_at).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

            </div>

            {/* Info Sidebar */}
            <div className="xl:col-span-1">
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-3">How Verification Works</h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <p>1. The system reads the binary content of your file.</p>
                  <p>2. It generates a unique SHA-256 hash fingerprint.</p>
                  <p>3. It queries the Supabase database for an exact match.</p>
                  <p>4. If not found, the system automatically logs it as a fraud attempt.</p>
                </div>
                <div className="mt-4 p-3 bg-gray-50 rounded-lg text-xs text-gray-500 border border-gray-100">
                  <strong>Note:</strong> Failed verification attempts are automatically flagged and stored for security auditing.
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