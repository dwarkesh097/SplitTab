import React, { useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { RootState } from '../../../app/store';
import {
  setCurrentGroup,
  clearCurrentGroup,
} from '../../../features/groups/groupSlice';
import { getUserName } from '../../../utils/userUtils';
import { getBalanceType } from '../../../utils/currencyUtils';
import { useGroupData } from '../../../hooks/useGroupData';
import { useCurrencyConverter } from '../../../hooks/useCurrencyConverter';
import { Colors } from '../../../constants/colors';
import { Typography } from '../../../constants/typography';
import { Spacing } from '../../../constants/spacing';
import { RootStackParamList } from '../../../navigation/types';
import { calculateGroupBalances } from '../../../utils/balanceCalculator';
import { styles } from '../styles/GroupDetailStyle';

type Props = NativeStackScreenProps<RootStackParamList, 'GroupDetail'>;

interface ActivityItem {
  id: string;
  type: 'expense' | 'settlement';
  data: any;
  timestamp: string;
}

export const GroupDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { groupId } = route.params;
  const dispatch = useDispatch();
  const { currentGroup } = useSelector((state: RootState) => state.groups);
  const { user } = useSelector((state: RootState) => state.auth);
  const { currencySymbol, convertAmount, formatAmount } =
    useCurrencyConverter();
  const { groupExpenses, groupSettlements } = useGroupData(groupId);

  React.useEffect(() => {
    dispatch(setCurrentGroup(groupId));
    return () => {
      dispatch(clearCurrentGroup());
    };
  }, [groupId, dispatch]);

  const balances = useMemo(() => {
    return calculateGroupBalances(
      groupId,
      groupExpenses,
      groupSettlements,
      user?.id || '',
    );
  }, [groupId, groupExpenses, groupSettlements, user?.id]);

  // ✅ Convert net balances to display currency
  // Net balance is already calculated in original expense currencies,
  // so we need to convert each expense's contribution properly.
  // calculateGroupBalances returns raw amounts — we convert them here.
  const convertedBalances = useMemo(() => {
    return balances.map(b => ({
      ...b,
      // netBalance is sum of splits in their original currencies.
      // We convert it assuming USD base (since expenses store currency per item).
      // For accurate conversion per-expense, we recalculate here.
      displayBalance: (() => {
        // Recalculate balance per expense in display currency
        let net = 0;
        groupExpenses.forEach(expense => {
          const expCurrency = expense.currency || 'USD';
          if (expense.paidBy === b.userId) {
            // This user paid — credit the full amount converted
            const converted = convertAmount(expense.amount, expCurrency);
            net += converted;
          }
          // Deduct this user's split
          const split = expense.splits?.find(s => s.userId === b.userId);
          if (split) {
            net -= convertAmount(split.amount, expCurrency);
          }
        });
        // Account for settlements
        groupSettlements.forEach(s => {
          const sCurrency = s.currency || 'USD';
          if (s.fromUser === b.userId) {
            net += convertAmount(s.amount, sCurrency); // paid out
          }
          if (s.toUser === b.userId) {
            net -= convertAmount(s.amount, sCurrency); // received
          }
        });
        return Math.round(net * 100) / 100;
      })(),
    }));
  }, [balances, groupExpenses, groupSettlements, convertAmount]);

  const activity = useMemo((): ActivityItem[] => {
    const expenseActivities = groupExpenses.map(expense => ({
      id: `expense-${expense.id}`,
      type: 'expense' as const,
      data: expense,
      timestamp: expense.date,
    }));

    const settlementActivities = groupSettlements.map(settlement => ({
      id: `settlement-${settlement.id}`,
      type: 'settlement' as const,
      data: settlement,
      timestamp: settlement.date,
    }));

    return [...expenseActivities, ...settlementActivities].sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );
  }, [groupExpenses, groupSettlements]);

  const getBalanceStyle = useCallback((balance: number) => {
    const type = getBalanceType(balance);
    switch (type) {
      case 'positive':
        return styles.positiveText;
      case 'negative':
        return styles.negativeText;
      default:
        return styles.settledText;
    }
  }, []);

  const renderBalanceCard = useCallback(() => {
    if (!currentGroup) return null;

    return (
      <Card style={styles.balanceCard}>
        <Text style={styles.balanceCardTitle}>Balances</Text>
        {convertedBalances.length === 0 ? (
          <Text style={styles.noBalanceText}>No balances yet</Text>
        ) : (
          convertedBalances.map(balance => {
            const isSettled = Math.abs(balance.displayBalance) < 0.01;
            return (
              <View key={balance.userId} style={styles.balanceRow}>
                <Text style={styles.balanceUserName}>
                  {getUserName(balance.userId, user)}
                </Text>
                <Text
                  style={[
                    styles.balanceValue,
                    isSettled
                      ? styles.settledText
                      : getBalanceStyle(balance.displayBalance),
                  ]}
                >
                  {isSettled
                    ? '✓ Settled'
                    : `${
                        balance.displayBalance > 0 ? '+' : ''
                      }${currencySymbol}${Math.abs(
                        balance.displayBalance,
                      ).toFixed(2)}`}
                </Text>
              </View>
            );
          })
        )}
        <Button
          title="Settle Up"
          onPress={() => navigation.navigate('Settlements', { groupId })}
          style={styles.settleUpButton}
        />
      </Card>
    );
  }, [
    currentGroup,
    convertedBalances,
    user,
    currencySymbol,
    getBalanceStyle,
    groupId,
    navigation,
  ]);

  const renderActivityItem = useCallback(
    ({ item }: { item: ActivityItem }) => {
      if (item.type === 'expense') {
        const expense = item.data;
        // ✅ Convert expense amount to display currency
        const displayAmount = formatAmount(
          expense.amount,
          expense.currency || 'USD',
        );
        return (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('ExpenseDetail', {
                expenseId: expense.id,
                groupId: groupId,
              })
            }
          >
            <Card style={styles.activityCard}>
              <View style={styles.activityRow}>
                <Icon name="receipt" size={24} color={Colors.primary} />
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>
                    {getUserName(expense.paidBy, user)} added{' '}
                    {expense.description}
                  </Text>
                  {/* ✅ Show converted amount */}
                  <Text style={styles.activityAmount}>{displayAmount}</Text>
                </View>
              </View>
              <Text style={styles.activityTime}>
                {new Date(expense.date).toLocaleDateString()}
              </Text>
            </Card>
          </TouchableOpacity>
        );
      }

      const settlement = item.data;
      // ✅ Convert settlement amount to display currency
      const displayAmount = formatAmount(
        settlement.amount,
        settlement.currency || 'USD',
      );
      return (
        <Card style={styles.activityCard}>
          <View style={styles.activityRow}>
            <Icon
              name="swap-horiz"
              size={24}
              color={Colors.categoryEntertainment}
            />
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>
                {getUserName(settlement.fromUser, user)} paid{' '}
                {getUserName(settlement.toUser, user)}
              </Text>
              {/* ✅ Show converted amount */}
              <Text style={styles.activityAmount}>{displayAmount}</Text>
            </View>
          </View>
          <Text style={styles.activityTime}>
            {new Date(settlement.date).toLocaleDateString()}
          </Text>
        </Card>
      );
    },
    [navigation, groupId, user, formatAmount],
  );

  if (!currentGroup) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.screenContainer}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.groupHeader}>
          <Text style={styles.groupIconEmoji}>{currentGroup.icon}</Text>
          <Text style={styles.groupNameText}>{currentGroup.name}</Text>
          {currentGroup.description && (
            <Text style={styles.groupDescriptionText}>
              {currentGroup.description}
            </Text>
          )}
          <Text style={styles.memberCountText}>
            {currentGroup.members.length} members
          </Text>
        </View>

        {renderBalanceCard()}

        <View style={styles.activitySection}>
          <View style={styles.activitySectionHeader}>
            <Text style={styles.activitySectionTitle}>Activity Feed</Text>
            <Button
              title="Add Expense"
              onPress={() => navigation.navigate('AddExpense', { groupId })}
              size="small"
            />
          </View>

          {activity.length === 0 ? (
            <View style={styles.emptyActivityContainer}>
              <Text style={styles.emptyActivityText}>No activity yet</Text>
              <Text style={styles.emptyActivitySubtext}>
                Add your first expense to get started
              </Text>
            </View>
          ) : (
            activity.map(item => (
              <React.Fragment key={item.id}>
                {renderActivityItem({ item })}
              </React.Fragment>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
};


