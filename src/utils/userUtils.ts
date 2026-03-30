import {User} from '../models/user.types';
import {MOCK_CONTACTS} from '../constants/mockContacts';

export const getUserName = (
  userId: string,
  currentUser: User | null,
): string => {
  if (!userId) return 'Unknown';
  if (userId === currentUser?.id) return 'You';
  const contact = MOCK_CONTACTS.find(c => c.id === userId);
  return contact?.name ?? `User ${userId.slice(-4)}`;
};

export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const getAvatarColor = (userId: string, colors: string[]): string => {
  const hash = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};