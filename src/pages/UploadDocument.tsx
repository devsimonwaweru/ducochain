import React, { useState } from 'react';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import { 
  UploadCloud, FileText, Info, Calendar, User, Truck, MapPin, 
  ShieldCheck, Hash, Clock, Save, Send, X, FilePlus, CheckCircle 
} from 'lucide-react';

const UploadDocument: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [formData, setFormData] = useState({
    docTitle: '', docType: 'Invoice', docId: '', issueDate: '',
    supplier: '', receiver: '', transporter: '', origin: '', destination: '',
  });

  const recentUploads = [
    { id: 'INV-1022', name: 'Invoice #1022', time: '2 hours ago' },
    { id: 'DN-54', name: 'Delivery Note #54', time: '5 hours ago' },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    if (e.dataTransfer.files[0]) setFile(e.dataTransfer.files[0]);
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setFile(e.target.files[0]);
  };

  const user = { name: 'Simon Kamau', role: 'Admin', initials: 'SK' };

  return (
    <div className="min-h-screen bg-app-bg">
      <Header user={user} onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="flex pt-16">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <main className="flex-1 lg:ml-64 p-6">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-primary font-display">Upload Supply Chain Document</h1>
              <p className="text-gray-500 text-sm mt-1">Record and track supply chain paperwork securely.</p>
            </div>
            <div className="mt-4 md:mt-0 bg-secondary/10 text-secondary border border-secondary/20 px-4 py-2 rounded-lg text-xs font-medium flex items-center gap-2">
              <Info className="w-4 h-4" />
              <span>Supported: PDF, JPG, PNG • Max Size: 10MB</span>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 space-y-6">
              {/* Document Information */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-secondary" /> Document Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Document Title</label>
                    <input type="text" name="docTitle" placeholder="e.g. Invoice #1023" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary" value={formData.docTitle} onChange={handleInputChange} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Document Type</label>
                    <select name="docType" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary" value={formData.docType} onChange={handleInputChange}>
                      <option>Invoice</option><option>Delivery Note</option><option>Purchase Order</option><option>Receipt</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Document ID</label>
                    <input type="text" name="docId" placeholder="e.g. INV-1023" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary" value={formData.docId} onChange={handleInputChange} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Issue Date</label>
                    <input type="date" name="issueDate" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary" value={formData.issueDate} onChange={handleInputChange} />
                  </div>
                </div>
              </div>

              {/* Supply Chain Details */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-secondary" /> Supply Chain Participants
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Supplier Name</label>
                    <input type="text" name="supplier" placeholder="e.g. ABC Manufacturing" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary" value={formData.supplier} onChange={handleInputChange} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Receiver / Retailer</label>
                    <input type="text" name="receiver" placeholder="e.g. City Supermarket" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary" value={formData.receiver} onChange={handleInputChange} />
                  </div>
                </div>
              </div>

              {/* File Upload */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <UploadCloud className="w-5 h-5 text-secondary" /> Upload Document File
                </h2>
                {!file ? (
                  <div className={`border-2 border-dashed rounded-xl p-10 text-center transition-colors cursor-pointer ${isDragging ? 'border-secondary bg-secondary/5' : 'border-gray-200 hover:border-gray-300 bg-gray-50/50'}`}
                    onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} onClick={() => document.getElementById('fileInput')?.click()}>
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                        <FilePlus className="w-6 h-6 text-primary" />
                      </div>
                      <p className="font-medium text-gray-700">Drag & Drop Document Here</p>
                      <p className="text-sm text-gray-400">or <span className="text-secondary font-medium">click to browse</span></p>
                    </div>
                    <input id="fileInput" type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} />
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between border border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-flagged/10 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-flagged" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{file.name}</p>
                        <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <button onClick={() => setFile(null)} className="p-1 hover:bg-gray-200 rounded-full"><X className="w-4 h-4 text-gray-500" /></button>
                  </div>
                )}
              </div>

              {/* Blockchain Preview */}
              <div className="bg-gradient-to-br from-gray-900 to-primary-dark rounded-xl shadow-sm p-6 text-white">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-secondary" /> Blockchain Record Preview
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                    <p className="text-gray-400 text-xs mb-1">Document Hash</p>
                    <p className="font-mono truncate">{file ? '0x8F4A9D23C...' : 'Waiting for file...'}</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                    <p className="text-gray-400 text-xs mb-1">Timestamp</p>
                    <p>{file ? new Date().toLocaleString() : 'Pending'}</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 justify-end">
                <a href="/dashboard" className="px-6 py-2.5 rounded-lg text-gray-600 hover:bg-gray-100 text-center font-medium">Cancel</a>
                <button className="px-6 py-2.5 rounded-lg border border-primary text-primary hover:bg-primary/5 font-medium flex items-center justify-center gap-2">
                  <Save className="w-4 h-4" /> Save Draft
                </button>
                <button className="px-6 py-2.5 rounded-lg bg-secondary hover:bg-secondary-dark text-white font-semibold flex items-center justify-center gap-2 shadow-md">
                  <Send className="w-4 h-4" /> Submit to Blockchain
                </button>
              </div>
            </div>

            {/* Sidebar Area */}
            <div className="xl:col-span-1 space-y-6">
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Recent Uploads</h3>
                <div className="space-y-3">
                  {recentUploads.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer group">
                      <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                        <p className="text-xs text-gray-400">{item.time}</p>
                      </div>
                      <CheckCircle className="w-4 h-4 text-verified opacity-0 group-hover:opacity-100 transition-opacity" />
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

export default UploadDocument;