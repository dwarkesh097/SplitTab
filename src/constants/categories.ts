import {Colors} from './colors';

export const CATEGORIES = ['Food', 'Travel', 'Utilities', 'Entertainment', 'Other'] as const;
export type ExpenseCategoryType = typeof CATEGORIES[number];

export const CATEGORY_COLORS: Record<ExpenseCategoryType, string> = {
  Food: Colors.categoryFood,
  Travel: Colors.categoryTravel,
  Utilities: Colors.categoryUtilities,
  Entertainment: Colors.categoryEntertainment,
  Other: Colors.categoryOther,
};

export const SPLIT_TYPES = ['EQUAL', 'EXACT', 'PERCENTAGE', 'SHARES'] as const;
export type SplitTypeType = typeof SPLIT_TYPES[number];