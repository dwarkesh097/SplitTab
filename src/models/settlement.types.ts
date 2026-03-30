export interface Settlement {
  id: string;
  groupId: string;
  fromUser: string;
  toUser: string;
  amount: number;
  currency: string;
  date: string;
  isFull: boolean;
  notes?: string;
  createdAt: string;
}

export interface Debt {
  from: string;
  to: string;
  amount: number;
}

export interface Balance {
  userId: string;
  netBalance: number; // Positive = user is owed, Negative = user owes
}