import {User} from './user.types';

export interface Group {
  id: string;
  name: string;
  icon: string;
  description?: string;
  members: string[]; // User IDs
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  isArchived: boolean;
  lastActivity: string;
  totalSpend: number;
}

export interface GroupMember extends User {
  balance: number; // Positive = owed, Negative = owes
  paidAmount: number;
  shareAmount: number;
}

export interface GroupSummary {
  id: string;
  name: string;
  icon: string;
  totalSpend: number;
  userBalance: number;
  lastActivity: string;
  memberCount: number;
  isArchived: boolean;
}