import React, { useState } from 'react';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import { Settings as SettingsIcon, Server, Bell, Shield, Save, RefreshCcw, CheckCircle, CircleDot, ToggleLeft, ToggleRight } from 'lucide-react';

const Settings: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [settings, setSettings] = useState({
    systemName: 'DocuChain Supply System', orgName: 'Supply Chain Authority', timezone: 'Africa/Nairobi', docSizeLimit: '10',
    networkType: 'Ethereum Testnet', nodeUrl: 'http://localhost:8545', contractAddress: '0x9F3A21B8F7C4...', gasLimit: '0.002',
    emailNotif: true, verificationNotif: true, blockchainNotif: true, errorNotif: false,
    sessionTimeout: '30', twoFactor: false,
  });
  
  const user = { name: 'Simon Kamau', role: 'Admin', initials: 'SK' };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => { setSettings({ ...settings, [e.target.name]: e.target.value }); };
  const handleToggle = (name: keyof typeof settings) => { setSettings(prev => ({ ...prev, [name]: !prev[name] })); };

  const Toggle: React.FC<{ enabled: boolean; onChange: () => void }> = ({ enabled, onChange }) => (
    <button type="button" onClick={onChange} className="focus:outline-none">
      {enabled ? <ToggleRight className="w-8 h-8 text-secondary" /> : <ToggleLeft className="w-8 h-8 text-gray-300" />}
    </button>
  );

  return (
    <div className="min-h-screen bg-app-bg">
      <Header user={user} onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="flex pt-16">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <main className="flex-1 lg:ml-64 p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-primary font-display">System Settings</h1>
            <p className="text-gray-500 text-sm mt-1">Manage DocuChain configuration and preferences.</p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 space-y-6">
              {/* General Settings */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
                  <SettingsIcon className="w-5 h-5 text-primary" /><h2 className="font-semibold text-gray-900">General Settings</h2>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">System Name</label><input type="text" name="systemName" className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-secondary" value={settings.systemName} onChange={handleChange} /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Organization Name</label><input type="text" name="orgName" className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-secondary" value={settings.orgName} onChange={handleChange} /></div>
                </div>
              </div>

              {/* Blockchain Config */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                  <div className="flex items-center gap-3"><Server className="w-5 h-5 text-secondary" /><h2 className="font-semibold text-gray-900">Blockchain Network</h2></div>
                  <div className="flex items-center gap-1.5 text-xs font-medium text-verified bg-verified/10 px-2 py-1 rounded-full"><CircleDot className="w-3 h-3 animate-pulse" /> Connected</div>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Network Type</label><select name="networkType" className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-secondary" value={settings.networkType} onChange={handleChange}><option>Ethereum Testnet</option><option>Private Blockchain</option></select></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Gas Limit</label><input type="text" name="gasLimit" className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-secondary" value={settings.gasLimit} onChange={handleChange} /></div>
                  <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Contract Address</label><input type="text" name="contractAddress" className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-secondary font-mono text-sm" value={settings.contractAddress} onChange={handleChange} /></div>
                </div>
              </div>

              {/* Security */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3"><Shield className="w-5 h-5 text-primary" /><h2 className="font-semibold text-gray-900">Security</h2></div>
                <div className="p-6 space-y-5">
                  <div className="flex items-center justify-between"><div><p className="text-sm font-medium text-gray-700">Two-Factor Authentication</p><p className="text-xs text-gray-500">Add extra security.</p></div><Toggle enabled={settings.twoFactor as boolean} onChange={() => handleToggle('twoFactor')} /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Session Timeout</label><select name="sessionTimeout" className="w-full max-w-xs px-4 py-2 border border-gray-200 rounded-lg bg-gray-50" value={settings.sessionTimeout} onChange={handleChange}><option>15</option><option>30</option><option>60</option></select></div>
                </div>
              </div>
            </div>

            {/* Right Side */}
            <div className="xl:col-span-1 space-y-6">
              {/* Notifications */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3"><Bell className="w-5 h-5 text-secondary" /><h2 className="font-semibold text-gray-900">Notifications</h2></div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between"><p className="text-sm text-gray-700">Email Notifications</p><Toggle enabled={settings.emailNotif as boolean} onChange={() => handleToggle('emailNotif')} /></div>
                  <div className="flex items-center justify-between border-t border-gray-50 pt-3"><p className="text-sm text-gray-700">Verification Alerts</p><Toggle enabled={settings.verificationNotif as boolean} onChange={() => handleToggle('verificationNotif')} /></div>
                  <div className="flex items-center justify-between border-t border-gray-50 pt-3"><p className="text-sm text-gray-700">Blockchain Alerts</p><Toggle enabled={settings.blockchainNotif as boolean} onChange={() => handleToggle('blockchainNotif')} /></div>
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-8 flex items-center justify-end gap-3 border-t border-gray-200 pt-6">
            <button onClick={() => window.location.reload()} className="flex items-center gap-2 px-5 py-2.5 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 font-medium text-sm"><RefreshCcw className="w-4 h-4" /> Reset</button>
            <button onClick={() => alert('Settings Saved!')} className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-dark font-medium text-sm shadow-sm"><Save className="w-4 h-4" /> Save Settings</button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;