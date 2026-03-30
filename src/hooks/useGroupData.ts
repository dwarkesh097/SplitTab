import {useEffect, useMemo} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../app/store';
import {fetchExpenses} from '../features/expenses/expenseSlice';
import {fetchSettlements} from '../features/settlements/settlementSlice';

export const useGroupData = (groupId: string) => {
  const dispatch = useDispatch();
  const {expenses} = useSelector((state: RootState) => state.expenses);
  const {settlements} = useSelector((state: RootState) => state.settlements);

  useEffect(() => {
    if (groupId) {
      dispatch(fetchExpenses(groupId) as any);
      dispatch(fetchSettlements(groupId) as any);
    }
  }, [groupId, dispatch]);

  const groupExpenses = useMemo(
    () => expenses.filter(e => e.groupId === groupId),
    [expenses, groupId],
  );

  const groupSettlements = useMemo(
    () => settlements.filter(s => s.groupId === groupId),
    [settlements, groupId],
  );

  return {groupExpenses, groupSettlements, allExpenses: expenses, allSettlements: settlements};
};