import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Settlement } from '../../models/settlement.types';

interface SettlementState {
  settlements: Settlement[];
  isLoading: boolean;
  error: string | null;
}

const initialState: SettlementState = {
  settlements: [],
  isLoading: false,
  error: null,
};

const settlementSlice = createSlice({
  name: 'settlements',
  initialState,
  reducers: {
    fetchSettlements: (state, action: PayloadAction<string>) => {
      state.isLoading = true;
    },
    fetchSettlementsSuccess: (state, action: PayloadAction<Settlement[]>) => {
      const incoming = action.payload;
      const merged = [...state.settlements];
      incoming.forEach(newS => {
        if (!merged.find(s => s.id === newS.id)) {
          merged.push(newS);
        }
      });
      state.settlements = merged;
      state.isLoading = false;
    },
    fetchSettlementsFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    createSettlement: (
      state,
      action: PayloadAction<Omit<Settlement, 'id' | 'createdAt'>>,
    ) => {
      state.isLoading = true;
    },
    createSettlementSuccess: (state, action: PayloadAction<Settlement>) => {
      const exists = state.settlements.find(s => s.id === action.payload.id);
      if (!exists) {
        state.settlements = [...state.settlements, action.payload];
      }
      state.isLoading = false;
    },
    createSettlementFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    deleteSettlementsByGroup: (state, action: PayloadAction<string>) => {
      const groupId = action.payload;
      state.settlements = state.settlements.filter(
        s => s.groupId !== groupId,
      );
    },
  },
});

export const {
  fetchSettlements,
  fetchSettlementsSuccess,
  fetchSettlementsFailure,
  createSettlement,
  createSettlementSuccess,
  createSettlementFailure,
  deleteSettlementsByGroup,
} = settlementSlice.actions;

export default settlementSlice.reducer;