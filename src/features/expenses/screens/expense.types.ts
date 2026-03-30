import { LocationResult } from "../../../hooks/Uselocationsearch";

export type ExpenseCategory =
  | 'Food'
  | 'Travel'
  | 'Utilities'
  | 'Entertainment'
  | 'Other';

export type SplitType = 'EQUAL' | 'EXACT' | 'PERCENTAGE' | 'SHARES';

export interface Split {
  userId: string;
  amount: number;
  percentage?: number;
  shares?: number;
}

export interface AuditLogEntry {
  timestamp: string;
  field: string;
  oldValue: any;
  newValue: any;
  modifiedBy: string;
}

export interface Expense {
  id: string;
  groupId: string;
  amount: number;
  currency: string;
  description: string;
  date: string;
  category: ExpenseCategory;
  paidBy: string;
  splitType: SplitType;
  splits: Split[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  auditLog?: AuditLogEntry[];
  location?: LocationResult;
}