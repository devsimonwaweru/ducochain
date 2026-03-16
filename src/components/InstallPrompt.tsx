// src/components/InstallPrompt.tsx
import React, { useState } from 'react';
import { Download, X, Smartphone } from 'lucide-react';
import { usePWA } from '../hooks/usePWA';

const InstallPrompt: React.FC = () => {
  const { isInstallable, installApp } = usePWA();
  const [showBanner, setShowBanner] = useState(true);

  if (!isInstallable || !showBanner) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white rounded-xl shadow-2xl border border-gray-100 p-4 z-50 animate-slide-up">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Smartphone className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">Install DocuChain</h3>
          <p className="text-sm text-gray-500 mt-0.5">
            Install this application on your device for offline access and a better experience.
          </p>
        </div>
        <button onClick={() => setShowBanner(false)} className="text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <div className="mt-4 flex gap-2">
        <button 
          onClick={installApp}
          className="flex-1 flex items-center justify-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg font-medium text-sm hover:bg-primary-dark transition-colors"
        >
          <Download className="w-4 h-4" />
          Install Now
        </button>
        <button 
          onClick={() => setShowBanner(false)}
          className="px-4 py-2.5 border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          Later
        </button>
      </div>
    </div>
  );
};

export default InstallPrompt;