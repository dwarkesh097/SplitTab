import {User} from './user.types';
import {CurrencyCode} from './user.types';

export type ExpenseCategory = 'Food' | 'Travel' | 'Utilities' | 'Entertainment' | 'Other';
export type SplitType = 'EQUAL' | 'EXACT' | 'PERCENTAGE' | 'SHARES';

export interface Split {
  userId: string;
  amount: number;
  percentage?: number;
  shares?: number;
}

export interface Expense {
  id: string;
  groupId: string;
  amount: number;
  currency: CurrencyCode;
  description: string;
  date: string;
  category: ExpenseCategory;
  paidBy: string;
  splitType: SplitType;
  splits: Split[];
  receiptUri?: string;
  location?: LocationData;
  auditLog: ExpenseAuditEntry[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  exchangeRate?: number;
  originalCurrency?: CurrencyCode;
}

export interface ExpenseAuditEntry {
  timestamp: string;
  field: string;
  oldValue: any;
  newValue: any;
  modifiedBy: string;
}

export interface LocationData {
  name: string;
  lat: number;
  lng: number;
  address: string;
}