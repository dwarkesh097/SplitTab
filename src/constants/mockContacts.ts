export interface Contact {
  id: string;
  name: string;
  email: string;
  avatarColor: string;
}

// ✅ Ye MOCK_USERS ke login users hain
// Unke IDs MOCK_USERS se match karte hain
export const MOCK_CONTACTS: Contact[] = [
  {
    id: 'user_john_001',
    name: 'John Doe',
    email: 'john@example.com',
    avatarColor: '#4ECDC4',
  },
  {
    id: 'user_jane_002',
    name: 'Jane Smith',
    email: 'jane@example.com',
    avatarColor: '#FF6B6B',
  },
  {
    id: 'user_mike_003',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    avatarColor: '#45B7D1',
  },
  {
    id: 'user_sarah_004',
    name: 'Sarah Williams',
    email: 'sarah@example.com',
    avatarColor: '#96CEB4',
  },
  {
    id: 'user_bob_005',
    name: 'Bob Wilson',
    email: 'bob@example.com',
    avatarColor: '#FFEAA7',
  },
  {
    id: 'user_alice_006',
    name: 'Alice Brown',
    email: 'alice@example.com',
    avatarColor: '#DDA0DD',
  },
];