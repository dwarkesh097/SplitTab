import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createSagaMiddleware from 'redux-saga';
import { all } from 'redux-saga/effects';

import authReducer from '../features/auth/authSlice';
import groupReducer from '../features/groups/groupSlice';
import expenseReducer from '../features/expenses/expenseSlice';
import settlementReducer from '../features/settlements/settlementSlice';
import currencyReducer from '../features/currency/currencySlice';

import { authSaga } from '../features/auth/authSaga';
import { groupSaga } from '../features/groups/groupSaga';
import { expenseSaga } from '../features/expenses/expenseSaga';
import { settlementSaga } from '../features/settlements/settlementSaga';
import { currencySaga } from '../features/currency/currencySaga';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth', 'currency', 'groups', 'expenses', 'settlements'],
};

const appReducer = combineReducers({
  auth: authReducer,
  groups: groupReducer,
  expenses: expenseReducer,
  settlements: settlementReducer,
  currency: currencyReducer,
});

const rootReducer = (state: any, action: any) => {
  if (action.type === 'auth/logout') {
    return appReducer(
      {
        auth: undefined,
        groups: undefined,
        expenses: undefined,
        settlements: undefined,
        currency: state?.currency,
      },
      action,
    );
  }
  return appReducer(state, action);
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(sagaMiddleware),
});

function* rootSaga() {
  yield all([
    authSaga(),
    groupSaga(),
    expenseSaga(),
    settlementSaga(),
    currencySaga(),
  ]);
}

sagaMiddleware.run(rootSaga);

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
