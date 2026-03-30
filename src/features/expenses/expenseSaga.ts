import {takeLatest, put, select} from 'redux-saga/effects';
import {
  createExpense,
  createExpenseSuccess,
  createExpenseFailure,
  fetchExpenses,
  fetchExpensesSuccess,
  fetchExpensesFailure,
  deleteExpense,
  deleteExpenseSuccess,
  deleteExpenseFailure,
  updateExpense,
  updateExpenseSuccess,
  updateExpenseFailure,
} from './expenseSlice';
import {updateGroupTotalSpend} from '../groups/groupSlice';
import {RootState} from '../../app/store';
import {Expense} from '../../models/expense.types';

function* handleCreateExpense(action: any) {
  try {
    const state: RootState = yield select();
    const user = state.auth.user;

    let splits = action.payload.splits;
    const group = state.groups.groups.find(
      (g: any) => g.id === action.payload.groupId,
    );
    const members = group?.members || [];

    let paidBy = action.payload.paidBy;
    const payingMember = members.find((m: string) => m === paidBy);
    if (!payingMember && paidBy === user?.id) {
      paidBy = user?.id;
    }

    if (!splits || splits.length === 0) {
      const perPerson = action.payload.amount / members.length;
      splits = members.map((memberId: string) => ({
        userId: memberId,
        amount: parseFloat(perPerson.toFixed(2)),
      }));
    }

    const newExpense: Expense = {
      ...action.payload,
      paidBy,
      splits,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      auditLog: [
        {
          timestamp: new Date().toISOString(),
          field: 'created',
          oldValue: null,
          newValue: 'Expense created',
          modifiedBy: user?.id || '',
        },
      ],
    };

    yield put(
      updateGroupTotalSpend({
        groupId: newExpense.groupId,
        amount: newExpense.amount,
      }),
    );
    yield put(createExpenseSuccess(newExpense));
  } catch (error) {
    yield put(createExpenseFailure('Failed to create expense'));
  }
}

function* handleUpdateExpense(action: any) {
  try {
    const state: RootState = yield select();
    const {id, updates, modifiedBy} = action.payload;

    const existing = state.expenses.expenses.find((e: Expense) => e.id === id);
    if (!existing) {
      yield put(updateExpenseFailure('Expense not found'));
      return;
    }

    const auditEntry = {
      timestamp: new Date().toISOString(),
      field: 'updated',
      oldValue: `amount: ${existing.amount}, desc: ${existing.description}`,
      newValue: `amount: ${updates.amount ?? existing.amount}, desc: ${updates.description ?? existing.description}`,
      modifiedBy,
    };

    const updatedExpense: Expense = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
      auditLog: [...(existing.auditLog || []), auditEntry],
    };

    yield put(updateExpenseSuccess(updatedExpense));
  } catch (error) {
    yield put(updateExpenseFailure('Failed to update expense'));
  }
}

function* handleFetchExpenses(action: any) {
  try {
    const groupId = action.payload;
    const state: RootState = yield select();

    const groupExpenses = state.expenses.expenses.filter(
      (e: any) => e.groupId === groupId,
    );
    const byGroup = state.expenses.expensesByGroup?.[groupId] || [];

    const seen = new Set<string>();
    const merged: any[] = [];

    [...byGroup, ...groupExpenses].forEach(e => {
      if (!seen.has(e.id)) {
        seen.add(e.id);
        merged.push(e);
      }
    });

    yield put(fetchExpensesSuccess(merged));
  } catch (error) {
    yield put(fetchExpensesFailure('Failed to fetch expenses'));
  }
}

function* handleDeleteExpense(action: any) {
  try {
    yield put(deleteExpenseSuccess(action.payload));
  } catch (error) {
    yield put(deleteExpenseFailure('Failed to delete expense'));
  }
}

export function* expenseSaga() {
  yield takeLatest(createExpense.type, handleCreateExpense);
  yield takeLatest(updateExpense.type, handleUpdateExpense);
  yield takeLatest(fetchExpenses.type, handleFetchExpenses);
  yield takeLatest(deleteExpense.type, handleDeleteExpense);
}