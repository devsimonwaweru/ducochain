// src/types/index.ts

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'User' | 'Auditor';
  avatarUrl?: string;
}

export interface NavItem {
  name: string;
  href: string;
  icon: string; // Icon name string
}

export interface StatCard {
  title: string;
  value: number;
  change?: number;
  icon: string;
  color: string; // Tailwind color class (e.g., 'blue', 'green')
}

export interface DocumentRecord {
  id: string;
  documentName: string;
  documentType: 'Invoice' | 'Delivery Note' | 'Purchase Order' | 'Receipt';
  uploadedBy: string;
  uploadDate: string;
  status: 'Verified' | 'Pending' | 'Flagged';
  txHash: string;
}

export interface BlockchainInfo {
  blockNumber: number;
  documentId: string;
  txHash: string;
  timestamp: string;
  networkStatus: 'Connected' | 'Disconnected';
}