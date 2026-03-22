/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import { 
  UploadCloud, FileText, Info, Send, X, FilePlus 
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { generateFileHash } from '../utils/hash';

const UploadDocument: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    docTitle: '', docType: 'Invoice', docId: '', issueDate: '',
    supplier: '', receiver: '', transporter: '', origin: '', destination: '',
  });
  
  const user = { name: 'Demo User', role: 'Supplier', initials: 'DU' };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    if (e.dataTransfer.files[0]) setFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async (action: 'draft' | 'blockchain') => {
    if (!file || !formData.docId) {
      alert("Please provide a Document ID and a File.");
      return;
    }

    setIsLoading(true);

    try {
      // 1. Generate Hash
      const docHash = await generateFileHash(file);

      // 2. Upload File to Storage
      const fileName = `${Date.now()}_${file.name}`;
      // Removed unused 'storageData' variable
      const { error: storageError } = await supabase.storage
        .from('documents')
        .upload(fileName, file);

      if (storageError) throw storageError;

      // 3. Get Public URL
      const { data: urlData } = supabase.storage
        .from('documents')
        .getPublicUrl(fileName);

      // 4. Save Metadata to Database
      const { error: dbError } = await supabase.from('documents').insert([
        {
          doc_id: formData.docId,
          title: formData.docTitle,
          type: formData.docType,
          supplier: formData.supplier,
          receiver: formData.receiver,
          file_url: urlData.publicUrl,
          hash: docHash,
          status: action === 'blockchain' ? 'Verified' : 'Pending'
        }
      ]);

      if (dbError) throw dbError;

      // 5. If Blockchain Action, save to blockchain_records
      if (action === 'blockchain') {
        await supabase.from('blockchain_records').insert([
          {
            doc_id: formData.docId,
            record_hash: docHash, // Updated to match typical schema column name
            tx_hash: `0x${Math.random().toString(16).slice(2)}`,
            block_number: Math.floor(Math.random() * 10000)
          }
        ]);
      }

      alert(`Success! Document ${formData.docId} saved.`);
      setFile(null);
      setFormData({ docTitle: '', docType: 'Invoice', docId: '', issueDate: '', supplier: '', receiver: '', transporter: '', origin: '', destination: '' });

    } catch (error: any) {
      console.error(error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
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
              <h1 className="text-2xl font-bold text-primary font-display">Upload Supply Chain Document</h1>
              <p className="text-gray-500 text-sm mt-1">Record and track supply chain paperwork securely.</p>
            </div>
            <div className="mt-4 md:mt-0 bg-secondary/10 text-secondary border border-secondary/20 px-4 py-2 rounded-lg text-xs font-medium flex items-center gap-2">
              <Info className="w-4 h-4" />
              <span>System: Connected to Supabase</span>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 space-y-6">
              
              {/* Form Section */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-secondary" /> Document Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Document ID (Required)</label>
                    <input type="text" name="docId" placeholder="e.g. INV-1023" className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-secondary" value={formData.docId} onChange={handleInputChange} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input type="text" name="docTitle" placeholder="Invoice Title" className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-secondary" value={formData.docTitle} onChange={handleInputChange} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select name="docType" className="w-full px-4 py-2.5 border rounded-lg bg-white" value={formData.docType} onChange={handleInputChange}>
                      <option>Invoice</option><option>Delivery Note</option><option>Purchase Order</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
                    <input type="text" name="supplier" placeholder="ABC Manufacturing" className="w-full px-4 py-2.5 border rounded-lg" value={formData.supplier} onChange={handleInputChange} />
                  </div>
                </div>
              </div>

              {/* Upload Section */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <UploadCloud className="w-5 h-5 text-secondary" /> Upload Document File
                </h2>
                {!file ? (
                  <div className={`border-2 border-dashed rounded-xl p-10 text-center transition-colors cursor-pointer ${isDragging ? 'border-secondary bg-secondary/5' : 'border-gray-200'}`}
                    onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} onClick={() => document.getElementById('fileInput')?.click()}>
                    <FilePlus className="w-10 h-10 mx-auto text-gray-400 mb-2" />
                    <p className="font-medium text-gray-700">Drag & Drop Document</p>
                    <input id="fileInput" type="file" className="hidden" onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])} />
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between border border-gray-200">
                    <div className="flex items-center gap-3">
                      <FileText className="w-6 h-6 text-secondary" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{file.name}</p>
                        <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                      </div>
                    </div>
                    <button onClick={() => setFile(null)} className="p-1 hover:bg-gray-200 rounded-full"><X className="w-4 h-4" /></button>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 justify-end">
                <button onClick={() => handleSubmit('draft')} disabled={isLoading} className="px-6 py-2.5 rounded-lg border border-primary text-primary font-medium hover:bg-primary/5 disabled:opacity-50">
                  {isLoading ? 'Saving...' : 'Save Draft'}
                </button>
                <button onClick={() => handleSubmit('blockchain')} disabled={isLoading} className="px-6 py-2.5 rounded-lg bg-secondary text-white font-semibold hover:bg-secondary-dark disabled:opacity-50 flex items-center gap-2">
                  <Send className="w-4 h-4" /> Submit to Blockchain
                </button>
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UploadDocument;