import { AvatarColor, CurrencyCode } from "../models/user.types";

export const MOCK_USERS = [
  {
    id: 'user_john_001',
    email: 'john@example.com',
    password: 'password123',
    name: 'John Doe',
    avatarColor: '#4ECDC4' as AvatarColor,
    displayCurrency: 'USD' as CurrencyCode,
  },
  {
    id: 'user_jane_002',
    email: 'jane@example.com',
    password: 'password123',
    name: 'Jane Smith',
    avatarColor: '#FF6B6B' as AvatarColor,
    displayCurrency: 'EUR' as CurrencyCode,
  },
  {
    id: 'user_mike_003',
    email: 'mike@example.com',
    password: 'password123',
    name: 'Mike Johnson',
    avatarColor: '#45B7D1' as AvatarColor,
    displayCurrency: 'USD' as CurrencyCode,
  },
  {
    id: 'user_sarah_004',
    email: 'sarah@example.com',
    password: 'password123',
    name: 'Sarah Williams',
    avatarColor: '#96CEB4' as AvatarColor,
    displayCurrency: 'USD' as CurrencyCode,
  },
];