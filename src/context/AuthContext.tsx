import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

// 1. Define User and Role Types
type UserRole = 'Admin' | 'Supplier' | 'Retailer' | 'Transporter';

interface User {
  email: string;
  name: string;
  role: UserRole;
  initials: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  isLoading: boolean;
}

// 2. Define Demo Users (As requested)
const DEMO_USERS: { [key: string]: { password: string; user: User } } = {
  'admin@docuchain.com': {
    password: 'admin123',
    user: { email: 'admin@docuchain.com', name: 'Admin User', role: 'Admin', initials: 'AD' }
  },
  'supplier@test.com': {
    password: 'supplier123',
    user: { email: 'supplier@test.com', name: 'John Supplier', role: 'Supplier', initials: 'JS' }
  },
  'retailer@test.com': {
    password: 'retailer123',
    user: { email: 'retailer@test.com', name: 'Jane Retailer', role: 'Retailer', initials: 'JR' }
  },
  'transporter@test.com': {
    password: 'transporter123',
    user: { email: 'transporter@test.com', name: 'Mike Transport', role: 'Transporter', initials: 'MT' }
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check local storage for existing session on load
    const storedUser = localStorage.getItem('docuchain_user');
    if (storedUser) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = (email: string, password: string): boolean => {
    const record = DEMO_USERS[email.toLowerCase()];
    if (record && record.password === password) {
      const loggedInUser = record.user;
      setUser(loggedInUser);
      localStorage.setItem('docuchain_user', JSON.stringify(loggedInUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('docuchain_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};