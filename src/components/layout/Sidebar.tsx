import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Upload, FileText, ShieldCheck, Blocks, PieChart, Users, Settings, X 
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Upload Document', href: '/upload', icon: Upload },
  { name: 'Document Records', href: '/records', icon: FileText },
  { name: 'Verify Document', href: '/verify', icon: ShieldCheck },
  { name: 'Blockchain Ledger', href: '/ledger', icon: Blocks },
  { name: 'Reports', href: '/reports', icon: PieChart },
  { name: 'User Management', href: '/users', icon: Users },
  { name: 'Settings', href: '/settings', icon: Settings },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-gray-200 z-40
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:block
      `}>
        {/* Close Button (Mobile Only) */}
        <div className="absolute top-2 right-2 lg:hidden">
            <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
            </button>
        </div>

        <nav className="p-4 space-y-1 h-[calc(100vh-8rem)] overflow-y-auto pt-8 lg:pt-4">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={onClose}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all
                ${isActive 
                  ? 'bg-secondary/10 text-secondary border-l-4 border-secondary' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}
              `}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-primary/5 to-secondary/5">
            <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
              <Blocks className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-900">Network Status</p>
              <p className="text-xs text-verified flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-verified rounded-full animate-pulse"></span>
                Connected
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;