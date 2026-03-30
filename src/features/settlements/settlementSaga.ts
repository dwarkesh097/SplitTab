import {takeLatest, put, select} from 'redux-saga/effects';
import {
  fetchSettlements,
  fetchSettlementsSuccess,
  fetchSettlementsFailure,
  createSettlement,
  createSettlementSuccess,
  createSettlementFailure,
} from './settlementSlice';
import {Settlement} from '../../models/settlement.types';
import {RootState} from '../../app/store';

function* handleFetchSettlements(
  action: ReturnType<typeof fetchSettlements>,
) {
  try {
    const state: RootState = yield select();
    const allSettlements = state.settlements.settlements || [];
    const groupSettlements = allSettlements.filter(
      (s: any) => s.groupId === action.payload,
    );
    yield put(fetchSettlementsSuccess(groupSettlements));
  } catch (error) {
    yield put(fetchSettlementsFailure('Failed to fetch settlements'));
  }
}

function* handleCreateSettlement(action: ReturnType<typeof createSettlement>) {
  try {
    const newSettlement: Settlement = {
      ...action.payload,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    yield put(createSettlementSuccess(newSettlement));
  } catch (error) {
    yield put(createSettlementFailure('Failed to create settlement'));
  }
}

export function* settlementSaga() {
  yield takeLatest(fetchSettlements.type, handleFetchSettlements);
  yield takeLatest(createSettlement.type, handleCreateSettlement);
}