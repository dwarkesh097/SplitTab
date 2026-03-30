import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ExchangeRate {
  base: string;
  rates: Record<string, number>;
  timestamp: number;
}

interface CurrencyState {
  rates: ExchangeRate | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: number | null;
}

const initialState: CurrencyState = {
  rates: null,
  isLoading: false,
  error: null,
  lastUpdated: null,
};

const currencySlice = createSlice({
  name: 'currency',
  initialState,
  reducers: {
    fetchExchangeRates: state => {
      state.isLoading = true;
    },
    fetchExchangeRatesSuccess: (state, action: PayloadAction<ExchangeRate>) => {
      state.rates = action.payload;
      state.lastUpdated = Date.now();
      state.isLoading = false;
    },
    fetchExchangeRatesFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearRates: state => {
      state.rates = null;
      state.lastUpdated = null;
    },
  },
});

export const convertAmount = (
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  rates: Record<string, number> | null,
): number => {
  if (!rates || fromCurrency === toCurrency) return amount;

  const eurAmount =
    fromCurrency === 'EUR' ? amount : amount / (rates[fromCurrency] || 1);

  const converted =
    toCurrency === 'EUR' ? eurAmount : eurAmount * (rates[toCurrency] || 1);

  return Math.round(converted * 100) / 100;
};

export const {
  fetchExchangeRates,
  fetchExchangeRatesSuccess,
  fetchExchangeRatesFailure,
  clearRates,
} = currencySlice.actions;

export default currencySlice.reducer;
