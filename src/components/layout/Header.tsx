import React, { useState } from 'react';
import { Search, Bell, ChevronDown, LogOut, Settings, User, Menu } from 'lucide-react';

interface HeaderProps {
  user: { name: string; role: string; initials: string };
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onMenuClick }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        
        {/* Left: Menu Button (Mobile) & Logo */}
        <div className="flex items-center gap-3">
          <button 
            onClick={onMenuClick} 
            className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none"
          >
            <Menu className="w-6 h-6" />
          </button>

          <img src="/logo.png" alt="Logo" className="h-8 w-auto object-contain" />
          
          <div className="hidden sm:block border-l border-gray-200 pl-3 ml-1">
            <h1 className="font-bold text-primary text-sm leading-tight">DocuChain</h1>
            <p className="text-[10px] text-gray-500 leading-tight">Supply Chain Tracker</p>
          </div>
        </div>

        {/* Center: Search */}
        <div className="flex-1 max-w-xl mx-4 hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search documents..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-secondary transition-all"
            />
          </div>
        </div>

        {/* Right: Notifications & Profile */}
        <div className="flex items-center gap-2">
          <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-flagged rounded-full"></span>
          </button>

          <div className="relative">
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-secondary flex items-center justify-center text-white font-semibold text-sm">
                {user.initials}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">{user.role}</p>
              </div>
              <ChevronDown className="hidden md:block w-4 h-4 text-gray-400" />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                <a href="#" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  <User className="w-4 h-4" /> Profile
                </a>
                <a href="#" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  <Settings className="w-4 h-4" /> Settings
                </a>
                <div className="border-t border-gray-100 my-2"></div>
                <a href="/login" className="flex items-center gap-3 px-4 py-2 text-sm text-flagged hover:bg-red-50">
                  <LogOut className="w-4 h-4" /> Logout
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;