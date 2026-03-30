import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  Expense,
  ExpenseCategory,
  Split,
  SplitType,
} from '../../models/expense.types';

interface ExpenseState {
  expenses: Expense[];
  expensesByGroup: Record<string, Expense[]>;
  currentExpense: Expense | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ExpenseState = {
  expenses: [],
  expensesByGroup: {},
  currentExpense: null,
  isLoading: false,
  error: null,
};

export interface CreateExpensePayload {
  groupId: string;
  amount: number;
  currency: string;
  description: string;
  date: string;
  category: ExpenseCategory;
  paidBy: string;
  splitType: SplitType;
  splits: Split[];
  createdBy: string;
}

const expenseSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    fetchExpenses: (state, action: PayloadAction<string>) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchExpensesSuccess: (state, action: PayloadAction<Expense[]>) => {
      const newExpenses = action.payload;

      if (newExpenses.length > 0) {
        const groupId = newExpenses[0].groupId;
        state.expensesByGroup[groupId] = newExpenses;

        const allGroupExpenses: Expense[] = [];
        Object.values(state.expensesByGroup).forEach(groupExps => {
          groupExps.forEach(exp => {
            if (!allGroupExpenses.find(e => e.id === exp.id)) {
              allGroupExpenses.push(exp);
            }
          });
        });
        state.expenses = allGroupExpenses;
      }

      state.isLoading = false;
    },
    fetchExpensesFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    createExpense: (state, action: PayloadAction<CreateExpensePayload>) => {
      state.isLoading = true;
      state.error = null;
    },
    createExpenseSuccess: (state, action: PayloadAction<Expense>) => {
      const exists = state.expenses.find(e => e.id === action.payload.id);
      if (!exists) {
        state.expenses = [...state.expenses, action.payload];
      }

      const groupId = action.payload.groupId;
      if (!state.expensesByGroup[groupId]) {
        state.expensesByGroup[groupId] = [];
      }
      const groupExists = state.expensesByGroup[groupId].find(
        e => e.id === action.payload.id,
      );
      if (!groupExists) {
        state.expensesByGroup[groupId] = [
          ...state.expensesByGroup[groupId],
          action.payload,
        ];
      }
      state.isLoading = false;
    },
    createExpenseFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    updateExpense: (
      state,
      action: PayloadAction<{
        id: string;
        updates: Partial<Expense>;
        modifiedBy: string;
      }>,
    ) => {
      state.isLoading = true;
      state.error = null;
    },
    updateExpenseSuccess: (state, action: PayloadAction<Expense>) => {
      const updated = action.payload;

      const idx = state.expenses.findIndex(e => e.id === updated.id);
      if (idx !== -1) {
        state.expenses[idx] = updated;
      }

      const groupId = updated.groupId;
      if (state.expensesByGroup[groupId]) {
        const gIdx = state.expensesByGroup[groupId].findIndex(
          e => e.id === updated.id,
        );
        if (gIdx !== -1) {
          state.expensesByGroup[groupId][gIdx] = updated;
        }
      }

      state.isLoading = false;
      state.error = null;
    },
    updateExpenseFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    deleteExpense: (state, action: PayloadAction<string>) => {
      state.isLoading = true;
      state.error = null;
    },
    deleteExpenseSuccess: (state, action: PayloadAction<string>) => {
      state.expenses = state.expenses.filter(e => e.id !== action.payload);
      Object.keys(state.expensesByGroup).forEach(groupId => {
        state.expensesByGroup[groupId] = state.expensesByGroup[groupId].filter(
          e => e.id !== action.payload,
        );
      });
      state.isLoading = false;
    },
    deleteExpenseFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    deleteExpensesByGroup: (state, action: PayloadAction<string>) => {
      const groupId = action.payload;
      state.expenses = state.expenses.filter(e => e.groupId !== groupId);
      delete state.expensesByGroup[groupId];
    },

    setCurrentExpense: (state, action: PayloadAction<string>) => {
      state.currentExpense =
        state.expenses.find(e => e.id === action.payload) || null;
    },
    clearCurrentExpense: state => {
      state.currentExpense = null;
    },
  },
});

export const {
  fetchExpenses,
  fetchExpensesSuccess,
  fetchExpensesFailure,
  createExpense,
  createExpenseSuccess,
  createExpenseFailure,
  updateExpense,
  updateExpenseSuccess,
  updateExpenseFailure,
  deleteExpense,
  deleteExpenseSuccess,
  deleteExpenseFailure,
  deleteExpensesByGroup,
  setCurrentExpense,
  clearCurrentExpense,
} = expenseSlice.actions;

export default expenseSlice.reducer;