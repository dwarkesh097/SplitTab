import {MOCK_CONTACTS} from '../constants/mockContacts';
import {User} from '../models/user.types';

export const getUserName = (
  userId: string,
  currentUser: User | null,
): string => {
  if (!userId) return 'Unknown';
  if (userId === currentUser?.id) return 'You';
  const contact = MOCK_CONTACTS.find(c => c.id === userId);
  return contact?.name ?? `User ${userId}`;
};

export const formatCurrency = (
  amount: number,
  symbol: string = '$',
): string => {
  return `${symbol}${Math.abs(amount).toFixed(2)}`;
};

export const getBalanceType = (
  balance: number,
): 'positive' | 'negative' | 'settled' => {
  if (Math.abs(balance) < 0.01) return 'settled';
  return balance > 0 ? 'positive' : 'negative';
};