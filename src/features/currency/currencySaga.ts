import { takeLatest, put, call } from 'redux-saga/effects';
import { fetchExchangeRates, fetchExchangeRatesSuccess } from './currencySlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://api.frankfurter.dev/v1/latest';
const CACHE_KEY = 'exchange_rates';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

function* handleFetchExchangeRates() {
  try {
    const cached: string = yield call(AsyncStorage.getItem, CACHE_KEY);

    if (cached) {
      const cachedData = JSON.parse(cached);
      const now = Date.now();
      if (now - cachedData.timestamp < CACHE_DURATION) {
        yield put(fetchExchangeRatesSuccess(cachedData));
        return;
      }
    }

    const response: Response = yield call(
      fetch,
      'https://api.frankfurter.dev/v1/latest?base=EUR&symbols=USD,INR,EUR',
    );

    if (!response.ok) throw new Error('Failed to fetch');

    const data = yield response.json();
    const exchangeRate = {
      base: 'EUR',
      rates: {
        ...data.rates,
        EUR: 1, // EUR to EUR = 1
      },
      timestamp: Date.now(),
    };

    yield call(AsyncStorage.setItem, CACHE_KEY, JSON.stringify(exchangeRate));
    yield put(fetchExchangeRatesSuccess(exchangeRate));
  } catch (error) {
    const cached: string = yield call(AsyncStorage.getItem, CACHE_KEY);
    if (cached) {
      yield put(fetchExchangeRatesSuccess(JSON.parse(cached)));
      return;
    }
    yield put(
      fetchExchangeRatesSuccess({
        base: 'EUR',
        rates: { USD: 1.08, INR: 89.5, EUR: 1 },
        timestamp: Date.now(),
      }),
    );
  }
}
export function* currencySaga() {
  yield takeLatest(fetchExchangeRates.type, handleFetchExchangeRates);
}

export function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  rates: ExchangeRate | null,
): number {
  if (!rates || fromCurrency === toCurrency) {
    return amount;
  }

  const amountInBase =
    fromCurrency === rates.base ? amount : amount / rates.rates[fromCurrency];

  const convertedAmount =
    toCurrency === rates.base
      ? amountInBase
      : amountInBase * rates.rates[toCurrency];

  return Math.round(convertedAmount * 100) / 100;
}
