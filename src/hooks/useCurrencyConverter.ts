import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import { CURRENCIES } from '../constants/currencies';

export const useCurrencyConverter = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { rates } = useSelector((state: RootState) => state.currency);

  const displayCurrency = user?.displayCurrency || 'USD';
  const currencySymbol = CURRENCIES[displayCurrency]?.symbol || '$';

  const convertAmount = (
    amount: number,
    fromCurrency: string = 'USD',
  ): number => {
    if (!rates?.rates || fromCurrency === displayCurrency) return amount;

    try {
      let eurAmount: number;
      if (fromCurrency === 'EUR') {
        eurAmount = amount;
      } else {
        eurAmount = amount / (rates.rates[fromCurrency] || 1);
      }

      let converted: number;
      if (displayCurrency === 'EUR') {
        converted = eurAmount;
      } else {
        converted = eurAmount * (rates.rates[displayCurrency] || 1);
      }

      return Math.round(converted * 100) / 100;
    } catch {
      return amount;
    }
  };

  const formatAmount = (
    amount: number,
    fromCurrency: string = 'USD',
  ): string => {
    const converted = convertAmount(amount, fromCurrency);
    return `${currencySymbol}${converted.toFixed(2)}`;
  };

  return {
    convertAmount,
    formatAmount,
    currencySymbol,
    displayCurrency,
    rates: rates?.rates || null,
    isOffline: !rates?.rates,
  };
};
