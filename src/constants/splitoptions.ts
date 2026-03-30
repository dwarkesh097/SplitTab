import { SplitType } from '../models/expense.types';
 
export const SPLIT_TYPE_OPTIONS: { key: SplitType; label: string; icon: string }[] = [
  { key: 'EQUAL', label: 'Equal', icon: '⚖️' },
  { key: 'EXACT', label: 'Exact', icon: '💯' },
  { key: 'PERCENTAGE', label: 'Percentage', icon: '%' },
  { key: 'SHARES', label: 'Shares', icon: '🔢' },
];
 