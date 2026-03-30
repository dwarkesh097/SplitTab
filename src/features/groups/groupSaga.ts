import { takeLatest, takeEvery, put, select } from 'redux-saga/effects';
import {
  fetchGroups,
  fetchGroupsSuccess,
  fetchGroupsFailure,
  createGroup,
  createGroupSuccess,
  createGroupFailure,
  archiveGroup,
  unarchiveGroup,
  deleteGroup,
} from './groupSlice';
import { deleteExpensesByGroup } from '../expenses/expenseSlice';
import { deleteSettlementsByGroup } from '../settlements/settlementSlice';
import { Group } from '../../models/group.types';
import { RootState } from '../../app/store';

const INITIAL_MOCK_GROUPS: Group[] = [];

function* handleFetchGroups() {
  try {
    const state: RootState = yield select();
    const existingGroups = state.groups.groups;

    if (existingGroups && existingGroups.length > 0) {
      yield put(fetchGroupsSuccess(existingGroups));
    } else {
      yield put(fetchGroupsSuccess(INITIAL_MOCK_GROUPS));
    }
  } catch (error) {
    yield put(fetchGroupsFailure('Failed to fetch groups'));
  }
}

function* handleCreateGroup(action: ReturnType<typeof createGroup>) {
  try {
    const state: RootState = yield select();
    const user = state.auth.user;

    const members = action.payload.members.includes(user?.id || '')
      ? action.payload.members
      : [user?.id || '', ...action.payload.members];

    const newGroup: Group = {
      ...action.payload,
      members,
      id: Date.now().toString(),
      createdBy: user?.id || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isArchived: false,
      lastActivity: new Date().toISOString(),
      totalSpend: 0,
    };

    yield put(createGroupSuccess(newGroup));
  } catch (error) {
    yield put(createGroupFailure('Failed to create group'));
  }
}

function* handleDeleteGroup(action: ReturnType<typeof deleteGroup>) {
  try {
    const groupId = action.payload;
    yield put(deleteExpensesByGroup(groupId));
    yield put(deleteSettlementsByGroup(groupId));
  } catch (error) {
    console.error('Delete group cascade error:', error);
  }
}

function* handleArchiveGroup(action: ReturnType<typeof archiveGroup>) {}

function* handleUnarchiveGroup(action: ReturnType<typeof unarchiveGroup>) {}

export function* groupSaga() {
  yield takeLatest(fetchGroups.type, handleFetchGroups);
  yield takeLatest(createGroup.type, handleCreateGroup);
  yield takeEvery(deleteGroup.type, handleDeleteGroup);
  yield takeEvery(archiveGroup.type, handleArchiveGroup);
  yield takeEvery(unarchiveGroup.type, handleUnarchiveGroup);
}
