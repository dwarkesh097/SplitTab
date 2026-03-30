import {Expense} from '../models/expense.types';
import {Settlement} from '../models/settlement.types';

export interface UserBalance {
  userId: string;
  netBalance: number;
  paidAmount: number;
  shareAmount: number;
}

export function calculateGroupBalances(
  groupId: string,
  expenses: Expense[],
  settlements: Settlement[],
  currentUserId: string
): UserBalance[] {
  const balances: Map<string, UserBalance> = new Map();

  // Step 1: Expenses se balances calculate karo
  expenses.forEach(expense => {
    // Payer ko credit
    const payerBalance = balances.get(expense.paidBy) || {
      userId: expense.paidBy,
      netBalance: 0,
      paidAmount: 0,
      shareAmount: 0,
    };
    payerBalance.paidAmount += expense.amount;
    payerBalance.netBalance += expense.amount;
    balances.set(expense.paidBy, payerBalance);

    // Har participant ko debit (unka share)
    expense.splits.forEach(split => {
      const userBalance = balances.get(split.userId) || {
        userId: split.userId,
        netBalance: 0,
        paidAmount: 0,
        shareAmount: 0,
      };
      userBalance.shareAmount += split.amount;
      userBalance.netBalance -= split.amount;
      balances.set(split.userId, userBalance);
    });
  });

  // Step 2: Settlements apply karo
  settlements.forEach(settlement => {
    // fromUser ne payment ki → uska debt kam hua → balance increase
    const fromBalance = balances.get(settlement.fromUser) || {
      userId: settlement.fromUser,
      netBalance: 0,
      paidAmount: 0,
      shareAmount: 0,
    };
    fromBalance.netBalance += settlement.amount;
    balances.set(settlement.fromUser, fromBalance);

    // toUser ne payment receive ki → uska receivable kam hua → balance decrease
    const toBalance = balances.get(settlement.toUser) || {
      userId: settlement.toUser,
      netBalance: 0,
      paidAmount: 0,
      shareAmount: 0,
    };
    toBalance.netBalance -= settlement.amount;
    balances.set(settlement.toUser, toBalance);
  });

  return Array.from(balances.values());
}

export function getCurrentUserBalance(
  balances: UserBalance[],
  currentUserId: string
): number {
  const userBalance = balances.find(b => b.userId === currentUserId);
  return userBalance?.netBalance || 0;
}


// export function calculateGroupBalances(
//   groupId: string,
//   expenses: Expense[],
//   settlements: Settlement[],
//   currentUserId: string
// ): UserBalance[] {
//   const balances: Map<string, UserBalance> = new Map();
  
//   expenses.forEach(expense => {
//     // Payer ko poora amount credit
//     const payerBalance = balances.get(expense.paidBy) || {
//       userId: expense.paidBy,
//       netBalance: 0,
//       paidAmount: 0,
//       shareAmount: 0,
//     };
//     payerBalance.paidAmount += expense.amount;
//     payerBalance.netBalance += expense.amount;
//     balances.set(expense.paidBy, payerBalance);
    
//     // ❌ Problem yahan hai - splits empty ho sakti hain
//     expense.splits.forEach(split => {
//       const userBalance = balances.get(split.userId) || {
//         userId: split.userId,
//         netBalance: 0,
//         paidAmount: 0,
//         shareAmount: 0,
//       };
//       userBalance.shareAmount += split.amount;
//       userBalance.netBalance -= split.amount;
//       balances.set(split.userId, userBalance);
//     });
//   });

//   return Array.from(balances.values());
// }