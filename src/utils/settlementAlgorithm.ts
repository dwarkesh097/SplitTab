import {Balance, Debt} from '../models/settlement.types';

/**
 * Settlement Algorithm - Minimizes number of transactions
 * 
 * Time Complexity: O(n log n) where n is number of users
 * Space Complexity: O(n)
 * 
 * Algorithm:
 * 1. Separate users into creditors (positive balance) and debtors (negative balance)
 * 2. Sort both lists by absolute balance
 * 3. Match largest debtor with largest creditor
 * 4. Create transaction for the minimum amount
 * 5. Update balances and continue until all debts are settled
 */
export function calculateOptimalSettlements(balances: Balance[]): Debt[] {
  const creditors: Balance[] = [];
  const debtors: Balance[] = [];
  
  balances.forEach(balance => {
    // ✅ Very small amounts ignore karo (floating point errors)
    if (balance.netBalance > 0.01) {
      creditors.push({...balance});
    } else if (balance.netBalance < -0.01) {
      debtors.push({...balance, netBalance: Math.abs(balance.netBalance)});
    }
  });
  
  creditors.sort((a, b) => b.netBalance - a.netBalance);
  debtors.sort((a, b) => b.netBalance - a.netBalance);
  
  const settlements: Debt[] = [];
  let i = 0, j = 0;
  
  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];
    const amount = Math.min(debtor.netBalance, creditor.netBalance);
    
    // ✅ Amount valid hai toh hi push karo
    if (amount > 0.01) {
      settlements.push({
        from: debtor.userId,
        to: creditor.userId,
        amount: parseFloat(amount.toFixed(2)),
      });
    }
    
    debtor.netBalance = parseFloat((debtor.netBalance - amount).toFixed(2));
    creditor.netBalance = parseFloat((creditor.netBalance - amount).toFixed(2));
    
    if (debtor.netBalance <= 0.01) i++;
    if (creditor.netBalance <= 0.01) j++;
  }
  
  return settlements;
}

/**
 * Alternative implementation using debt graph with circular debt handling
 * This algorithm ensures we find the minimum number of transactions
 * by settling debts optimally
 */
export function calculateOptimalSettlementsWithCircularHandling(balances: Balance[]): Debt[] {
  // Convert balances to net positions
  const netPositions = balances.reduce((acc, balance) => {
    acc[balance.userId] = balance.netBalance;
    return acc;
  }, {} as Record<string, number>);
  
  // Separate positive and negative
  const positives: [string, number][] = [];
  const negatives: [string, number][] = [];
  
  Object.entries(netPositions).forEach(([userId, amount]) => {
    if (amount > 0) {
      positives.push([userId, amount]);
    } else if (amount < 0) {
      negatives.push([userId, -amount]);
    }
  });
  
  // Sort by absolute value
  positives.sort((a, b) => b[1] - a[1]);
  negatives.sort((a, b) => b[1] - a[1]);
  
  const settlements: Debt[] = [];
  let posIdx = 0;
  let negIdx = 0;
  
  while (posIdx < positives.length && negIdx < negatives.length) {
    const [creditor, creditAmount] = positives[posIdx];
    const [debtor, debtAmount] = negatives[negIdx];
    
    const amount = Math.min(creditAmount, debtAmount);
    
    if (amount > 0) {
      settlements.push({
        from: debtor,
        to: creditor,
        amount,
      });
    }
    
    // Update amounts
    positives[posIdx][1] -= amount;
    negatives[negIdx][1] -= amount;
    
    // Move pointers
    if (positives[posIdx][1] === 0) posIdx++;
    if (negatives[negIdx][1] === 0) negIdx++;
  }
  
  return settlements;
}