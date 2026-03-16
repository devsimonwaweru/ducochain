import React, { useState } from 'react';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import { Users, UserCircle, Shield, Briefcase, Plus, Edit, Ban, X, CheckCircle } from 'lucide-react';



const mockUsers = [
  { id: 1, name: 'John Mwangi', company: 'ABC Manufacturing', role: 'Supplier', email: 'john@abc.com', status: 'Active' },
  { id: 2, name: 'Jane Doe', company: 'City Supermarket', role: 'Retailer', email: 'jane@city.com', status: 'Active' },
  { id: 3, name: 'Peter Smith', company: 'Swift Logistics', role: 'Transporter', email: 'peter@swift.com', status: 'Inactive' },
];

const UserManagement: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const user = { name: 'Simon Kamau', role: 'Admin', initials: 'SK' };

  const getStatusClasses = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-verified/10 text-verified';
      case 'Inactive': return 'bg-gray-100 text-gray-600';
      default: return 'bg-flagged/10 text-flagged';
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
              <h1 className="text-2xl font-bold text-primary font-display">System User Management</h1>
              <p className="text-gray-500 text-sm mt-1">Manage suppliers, retailers, and administrators.</p>
            </div>
            <button onClick={() => setIsModalOpen(true)} className="mt-4 md:mt-0 inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-lg shadow-sm font-medium text-sm">
              <Plus className="w-4 h-4" /> Add New User
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-gray-50"><Users className="w-5 h-5 text-primary" /></div><div><p className="text-2xl font-bold text-gray-900">128</p><p className="text-xs text-gray-500">Total Users</p></div></div></div>
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-gray-50"><Briefcase className="w-5 h-5 text-blue-600" /></div><div><p className="text-2xl font-bold text-gray-900">40</p><p className="text-xs text-gray-500">Suppliers</p></div></div></div>
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-gray-50"><UserCircle className="w-5 h-5 text-purple-600" /></div><div><p className="text-2xl font-bold text-gray-900">52</p><p className="text-xs text-gray-500">Retailers</p></div></div></div>
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-gray-50"><Shield className="w-5 h-5 text-flagged" /></div><div><p className="text-2xl font-bold text-gray-900">6</p><p className="text-xs text-gray-500">Admins</p></div></div></div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase px-5 py-3">User</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase px-5 py-3 hidden md:table-cell">Company</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase px-5 py-3">Role</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase px-5 py-3">Status</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase px-5 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {mockUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xs font-bold">{u.name.split(' ').map(n => n[0]).join('')}</div>
                          <div><span className="font-medium text-gray-900 text-sm block">{u.name}</span><span className="text-xs text-gray-500">{u.email}</span></div>
                        </div>
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell text-sm text-gray-600">{u.company}</td>
                      <td className="px-5 py-4"><span className="flex items-center gap-1.5 text-sm text-gray-700">{u.role === 'Supplier' ? <Briefcase className="w-4 h-4" /> : <UserCircle className="w-4 h-4" />} {u.role}</span></td>
                      <td className="px-5 py-4"><span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusClasses(u.status)}`}>{u.status}</span></td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1">
                          <button className="p-1.5 hover:bg-gray-100 rounded-md text-gray-500 hover:text-primary transition-colors" title="Edit"><Edit className="w-4 h-4" /></button>
                          <button className="p-1.5 hover:bg-red-50 rounded-md text-gray-500 hover:text-flagged transition-colors" title="Deactivate"><Ban className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Add User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black/40" onClick={() => setIsModalOpen(false)}></div>
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6 z-10">
              <div className="flex justify-between items-center mb-4"><h3 className="text-lg font-semibold text-gray-900">Add New User</h3><button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-gray-100 rounded-full"><X className="w-5 h-5" /></button></div>
              <form className="space-y-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label><input type="text" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary" placeholder="John Doe" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label><input type="email" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary" placeholder="user@company.com" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Role</label><select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary bg-white"><option>Supplier</option><option>Retailer</option><option>Transporter</option><option>Admin</option></select></div>
                <button type="button" onClick={() => { alert('User Created!'); setIsModalOpen(false); }} className="w-full bg-secondary text-white font-semibold py-2.5 rounded-lg hover:bg-secondary-dark transition-colors flex items-center justify-center gap-2"><CheckCircle className="w-4 h-4" /> Create User</button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;