import {CurrencyCode} from '../models/user.types';

export const AVATAR_COLORS: string[] = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
  '#FFEAA7', '#DDA0DD', '#FFB347', '#B0C4DE',
];

export const CURRENCIES: Record<CurrencyCode, {code: CurrencyCode; name: string; symbol: string}> = {
  USD: {code: 'USD', name: 'US Dollar', symbol: '$'},
  EUR: {code: 'EUR', name: 'Euro', symbol: '€'},
  INR: {code: 'INR', name: 'Indian Rupee', symbol: '₹'},
};

export const CURRENCY_LIST = Object.values(CURRENCIES);