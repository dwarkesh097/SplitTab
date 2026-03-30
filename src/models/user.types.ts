export interface User {
  id: string;
  name: string;
  email: string;
  avatarColor: AvatarColor;
  displayCurrency: CurrencyCode;
  createdAt: string;
  updatedAt: string;
}

export interface UserStats {
  totalPaid: number;
  totalSettled: number;
  activeGroups: number;
}

export type AvatarColor = 
  | '#FF6B6B' // Coral
  | '#4ECDC4' // Turquoise
  | '#45B7D1' // Sky Blue
  | '#96CEB4' // Sage
  | '#FFEAA7' // Cream
  | '#DDA0DD' // Plum
  | '#FFB347' // Apricot
  | '#B0C4DE'; // Light Steel Blue

export type CurrencyCode = 'USD' | 'EUR' | 'INR';

export interface Currency {
  code: CurrencyCode;
  symbol: string;
  name: string;
}

export const CURRENCIES: Record<CurrencyCode, Currency> = {
  USD: { code: 'USD', symbol: '$', name: 'US Dollar' },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro' },
  INR: { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
};