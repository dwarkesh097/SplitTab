export const formatCurrency = (
  amount: number,
  symbol: string = '$',
  decimals: number = 2,
): string => {
  return `${symbol}${Math.abs(amount).toFixed(decimals)}`;
};

export const getBalanceType = (
  balance: number,
): 'positive' | 'negative' | 'settled' => {
  if (Math.abs(balance) < 0.01) return 'settled';
  return balance > 0 ? 'positive' : 'negative';
};

export const parseAmount = (value: string): number => {
  const parsed = parseFloat(value);
  return isNaN(parsed) ? 0 : parsed;
};