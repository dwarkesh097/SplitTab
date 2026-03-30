import { takeLatest, put, call, select } from 'redux-saga/effects';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  onboardUser,
  onboardUserSuccess,
  onboardUserFailure,
  login,
  loginSuccess,
  loginFailure,
  updateUser,
  updateUserSuccess,
  logout,
} from './authSlice';
import { User, AvatarColor, CurrencyCode } from '../../models/user.types';
import { RootState } from '../../app/store';
import { fetchExchangeRates } from '../currency/currencySlice';

const MOCK_USERS = [
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

function* handleOnboardUser(action: ReturnType<typeof onboardUser>) {
  try {
    const { name, email, avatarColor, currency } = action.payload;

    const newUser: User = {
      id: `user_${Date.now()}`,
      name,
      email,
      avatarColor,
      displayCurrency: currency,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    yield call(AsyncStorage.setItem, 'user', JSON.stringify(newUser));
    yield put(onboardUserSuccess(newUser));
    yield put(fetchExchangeRates()); // ✅ ADD
  } catch (error) {
    yield put(onboardUserFailure('Failed to create user'));
  }
}

function* handleLogin(action: ReturnType<typeof login>) {
  try {
    const { email, password } = action.payload;
    const user = MOCK_USERS.find(
      u => u.email === email && u.password === password,
    );
    if (!user) throw new Error('Invalid credentials');

    const currentUser: User = {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarColor: user.avatarColor,
      displayCurrency: user.displayCurrency,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    yield call(AsyncStorage.setItem, 'user', JSON.stringify(currentUser));
    yield put(loginSuccess(currentUser));
    yield put(fetchExchangeRates()); // ✅ ADD
  } catch (error) {
    yield put(
      loginFailure(error instanceof Error ? error.message : 'Login failed'),
    );
  }
}

function* handleUpdateUser(action: ReturnType<typeof updateUser>) {
  try {
    const currentUser: User = yield select(
      (state: RootState) => state.auth.user,
    );

    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        ...action.payload,
        updatedAt: new Date().toISOString(),
      };

      yield call(AsyncStorage.setItem, 'user', JSON.stringify(updatedUser));
      yield put(updateUserSuccess(updatedUser));
    }
  } catch (error) {
    console.error('Failed to update user:', error);
  }
}

function* handleLogout() {
  try {
    yield call(AsyncStorage.removeItem, 'user');
  } catch (error) {
    console.error('Logout error:', error);
  }
}

export function* authSaga() {
  yield takeLatest(onboardUser.type, handleOnboardUser);
  yield takeLatest(login.type, handleLogin);
  yield takeLatest(updateUser.type, handleUpdateUser);
  yield takeLatest(logout.type, handleLogout);
}
