import {calculateOptimalSettlements, calculateOptimalSettlementsWithCircularHandling} from './settlementAlgorithm';
import {Balance, Debt} from '../models/settlement.types';

describe('Settlement Algorithm', () => {
  describe('calculateOptimalSettlements', () => {
    it('should handle simple two-person debt', () => {
      const balances: Balance[] = [
        {userId: '1', netBalance: -100},
        {userId: '2', netBalance: 100},
      ];
      
      const settlements = calculateOptimalSettlements(balances);
      
      expect(settlements).toHaveLength(1);
      expect(settlements[0]).toEqual({
        from: '1',
        to: '2',
        amount: 100,
      });
    });
    
    it('should handle multiple debts with one person owed', () => {
      const balances: Balance[] = [
        {userId: '1', netBalance: -50},
        {userId: '2', netBalance: -30},
        {userId: '3', netBalance: 80},
      ];
      
      const settlements = calculateOptimalSettlements(balances);
      
      expect(settlements).toHaveLength(2);
      expect(settlements[0].to).toBe('3');
      expect(settlements[1].to).toBe('3');
      expect(settlements[0].amount + settlements[1].amount).toBe(80);
    });
    
    it('should handle circular debts optimally', () => {
      const balances: Balance[] = [
        {userId: '1', netBalance: -100},
        {userId: '2', netBalance: -50},
        {userId: '3', netBalance: 150},
      ];
      
      const settlements = calculateOptimalSettlements(balances);
      
      // Should settle in 2 transactions instead of 3
      expect(settlements.length).toBeLessThanOrEqual(2);
    });
    
    it('should handle zero balance users', () => {
      const balances: Balance[] = [
        {userId: '1', netBalance: 0},
        {userId: '2', netBalance: -100},
        {userId: '3', netBalance: 100},
      ];
      
      const settlements = calculateOptimalSettlements(balances);
      
      expect(settlements).toHaveLength(1);
      expect(settlements[0].from).toBe('2');
      expect(settlements[0].to).toBe('3');
    });
    
    it('should handle all zero balances', () => {
      const balances: Balance[] = [
        {userId: '1', netBalance: 0},
        {userId: '2', netBalance: 0},
      ];
      
      const settlements = calculateOptimalSettlements(balances);
      
      expect(settlements).toHaveLength(0);
    });
  });
  
  describe('calculateOptimalSettlementsWithCircularHandling', () => {
    it('should handle complex circular debt scenario', () => {
      // A owes B $100, B owes C $50, C owes A $30
      const balances: Balance[] = [
        {userId: 'A', netBalance: -20},  // Net: owes $20
        {userId: 'B', netBalance: 50},   // Net: owed $50
        {userId: 'C', netBalance: -30},  // Net: owes $30
      ];
      
      const settlements = calculateOptimalSettlementsWithCircularHandling(balances);
      
      // Should find optimal settlements
      expect(settlements.length).toBeLessThan(3);
      
      // Total amount should be consistent
      const totalAmount = settlements.reduce((sum, s) => sum + s.amount, 0);
      expect(totalAmount).toBe(50);
    });
    
    it('should maintain balance consistency', () => {
      const balances: Balance[] = [
        {userId: '1', netBalance: -200},
        {userId: '2', netBalance: -100},
        {userId: '3', netBalance: 300},
      ];
      
      const settlements = calculateOptimalSettlementsWithCircularHandling(balances);
      
      // Verify that sums match
      const totalFrom = settlements.reduce((sum, s) => sum + s.amount, 0);
      expect(totalFrom).toBe(300);
    });
  });
});