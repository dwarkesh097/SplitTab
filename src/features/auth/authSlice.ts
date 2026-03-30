import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, AvatarColor, CurrencyCode } from '../../models/user.types';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isOnboarded: boolean;
}

const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
  isOnboarded: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    onboardUser: (
      state,
      action: PayloadAction<{
        name: string;
        email: string;
        avatarColor: AvatarColor;
        currency: CurrencyCode;
      }>,
    ) => {
      state.isLoading = true;
      state.error = null;
    },
    onboardUserSuccess: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isOnboarded = true;
      state.isLoading = false;
    },
    onboardUserFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    login: (
      state,
      action: PayloadAction<{ email: string; password: string }>,
    ) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isOnboarded = true;
      state.isLoading = false;
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    logout: state => {
      state.user = null;
      state.isOnboarded = false;
      state.error = null;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    updateUserSuccess: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
  },
});

export const {
  onboardUser,
  onboardUserSuccess,
  onboardUserFailure,
  login,
  loginSuccess,
  loginFailure,
  logout,
  updateUser,
  updateUserSuccess,
} = authSlice.actions;

export default authSlice.reducer;
