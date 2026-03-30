import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { RootState } from '../../../app/store';
import {
  createSettlement,
  fetchSettlements,
} from '../../../features/settlements/settlementSlice';
import { calculateOptimalSettlements } from '../../../utils/settlementAlgorithm';
import { getUserName } from '../../../utils/userUtils';
import { getBalanceType } from '../../../utils/currencyUtils';
import { useCurrencyConverter } from '../../../hooks/useCurrencyConverter';
import { Colors } from '../../../constants/colors';
import { RootStackParamList } from '../../../navigation/types';
import { calculateGroupBalances } from '../../../utils/balanceCalculator';
import { styles } from '../styles/SettlementsStyle';

type Props = NativeStackScreenProps<RootStackParamList, 'Settlements'>;

type FilterType = 'all' | 'incoming' | 'outgoing';

export const SettlementsScreen: React.FC<Props> = ({ route }) => {
  const { groupId } = route.params;
  const dispatch = useDispatch();
  const { settlements } = useSelector((state: RootState) => state.settlements);
  const { expenses } = useSelector((state: RootState) => state.expenses);
  const { user } = useSelector((state: RootState) => state.auth);
  const { currencySymbol, formatAmount, convertAmount } =
    useCurrencyConverter();
  const [showSettlementModal, setShowSettlementModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [settlementAmount, setSettlementAmount] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('all');

  useEffect(() => {
    dispatch(fetchSettlements(groupId) as any);
  }, [groupId, dispatch]);

  const groupExpenses = useMemo(
    () => expenses.filter(e => e.groupId === groupId),
    [expenses, groupId],
  );
  const groupSettlements = useMemo(
    () => settlements.filter(s => s.groupId === groupId),
    [settlements, groupId],
  );

  // ✅ Calculate balances in display currency
  const { convertedBalances, suggestedSettlements, currentMyNet } =
    useMemo(() => {
      const rawBalances = calculateGroupBalances(
        groupId,
        groupExpenses,
        groupSettlements,
        user?.id || '',
      );

      // Convert each user's balance to display currency
      const converted = rawBalances.map(b => {
        let net = 0;
        groupExpenses.forEach(expense => {
          const expCurrency = expense.currency || 'USD';
          if (expense.paidBy === b.userId) {
            net += convertAmount(expense.amount, expCurrency);
          }
          const split = expense.splits?.find(s => s.userId === b.userId);
          if (split) {
            net -= convertAmount(split.amount, expCurrency);
          }
        });
        groupSettlements.forEach(s => {
          const sCurrency = s.currency || 'USD';
          if (s.fromUser === b.userId) {
            net += convertAmount(s.amount, sCurrency);
          }
          if (s.toUser === b.userId) {
            net -= convertAmount(s.amount, sCurrency);
          }
        });
        return { ...b, netBalance: Math.round(net * 100) / 100 };
      });

      const netBalances = converted.map(b => ({
        userId: b.userId,
        netBalance: b.netBalance,
      }));

      const myNet = converted.find(b => b.userId === user?.id)?.netBalance || 0;

      return {
        convertedBalances: converted,
        suggestedSettlements: calculateOptimalSettlements(netBalances),
        currentMyNet: myNet,
      };
    }, [groupExpenses, groupSettlements, groupId, user?.id, convertAmount]);

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

  const handleSettleUp = useCallback(
    (balanceUser: any) => {
      const payableAmount = Math.min(
        Math.abs(currentMyNet),
        Math.abs(balanceUser.netBalance),
      );
      setSelectedUser(balanceUser);
      setSettlementAmount(payableAmount.toFixed(2));
      setShowSettlementModal(true);
    },
    [currentMyNet],
  );

  const handleCreateSettlement = useCallback(() => {
    if (!selectedUser || !settlementAmount) return;
    const amount = parseFloat(settlementAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }
    if (!user?.id) return;
    const maxPayable = Math.min(
      Math.abs(currentMyNet),
      Math.abs(selectedUser.netBalance),
    );
    if (amount > maxPayable + 0.01) {
      Alert.alert(
        'Invalid Amount',
        `Maximum you can pay is ${currencySymbol}${maxPayable.toFixed(2)}`,
      );
      return;
    }
    dispatch(
      createSettlement({
        groupId,
        fromUser: user.id,
        toUser: selectedUser.userId,
        amount,
        currency: 'USD',
        date: new Date().toISOString(),
        isFull: amount >= maxPayable - 0.01,
        notes: '',
      }) as any,
    );
    setShowSettlementModal(false);
    setSelectedUser(null);
    setSettlementAmount('');
    Alert.alert('Success', 'Settlement recorded successfully');
  }, [
    selectedUser,
    settlementAmount,
    user,
    currentMyNet,
    groupId,
    currencySymbol,
    dispatch,
  ]);

  const getFilteredSettlements = useCallback(() => {
    let filtered = groupSettlements;
    if (filterType === 'incoming')
      filtered = filtered.filter(s => s.toUser === user?.id);
    if (filterType === 'outgoing')
      filtered = filtered.filter(s => s.fromUser === user?.id);
    return filtered.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }, [groupSettlements, filterType, user?.id]);

  const renderBalanceCard = useCallback(
    () => (
      <Card style={styles.balanceCard}>
        <Text style={styles.cardTitle}>Balances</Text>
        {convertedBalances.map(balance => {
          const isCurrentUser = balance.userId === user?.id;
          const absoluteBalance = Math.abs(balance.netBalance);
          const isSettled = absoluteBalance < 0.01;
          const isOwedToMe = balance.netBalance > 0;
          const isIOwe = balance.netBalance < 0;

          return (
            <View key={balance.userId} style={styles.balanceRow}>
              <View style={styles.balanceRowInfo}>
                <Text style={styles.balanceUserName}>
                  {getUserName(balance.userId, user)}
                </Text>
                {/* ✅ Already converted netBalance */}
                <Text
                  style={[
                    styles.balanceValue,
                    isSettled
                      ? styles.settledText
                      : getBalanceStyle(balance.netBalance),
                  ]}
                >
                  {isSettled
                    ? '✓ Settled'
                    : `${
                        balance.netBalance > 0 ? '+' : ''
                      }${currencySymbol}${absoluteBalance.toFixed(2)}`}
                </Text>
              </View>
              {!isCurrentUser && !isSettled && (
                <>
                  {currentMyNet < -0.01 && isOwedToMe && (
                    <Button
                      title="Pay"
                      onPress={() => handleSettleUp(balance)}
                      size="small"
                      variant="primary"
                    />
                  )}
                  {currentMyNet > 0.01 && isIOwe && (
                    <Button
                      title="Remind"
                      onPress={() =>
                        Alert.alert(
                          '🔔 Reminder',
                          `${getUserName(
                            balance.userId,
                            user,
                          )} owes you ${currencySymbol}${absoluteBalance.toFixed(
                            2,
                          )}`,
                          [{ text: 'OK' }],
                        )
                      }
                      size="small"
                      variant="outline"
                    />
                  )}
                </>
              )}
            </View>
          );
        })}
      </Card>
    ),
    [
      convertedBalances,
      user,
      currencySymbol,
      currentMyNet,
      handleSettleUp,
      getBalanceStyle,
    ],
  );

  const renderSuggestedSettlements = useCallback(() => {
    if (suggestedSettlements.length === 0) return null;
    return (
      <Card style={styles.suggestionsCard}>
        <Text style={styles.cardTitle}>Suggested Settlements</Text>
        <Text style={styles.suggestionNoteText}>
          To minimize transactions, we suggest:
        </Text>
        {suggestedSettlements.map((settlement, index) => {
          const isMyPayment = settlement.from === user?.id;
          const isMyReceiving = settlement.to === user?.id;
          const actionText = isMyPayment
            ? `You pay ${getUserName(settlement.to, user)}`
            : `${getUserName(settlement.from, user)} pays ${getUserName(
                settlement.to,
                user,
              )}`;
          // ✅ settlement.amount is already in display currency from convertedBalances
          return (
            <View key={index} style={styles.suggestionRow}>
              <Icon
                name="swap-horiz"
                size={20}
                color={
                  isMyPayment
                    ? Colors.negative
                    : isMyReceiving
                    ? Colors.positive
                    : Colors.textMuted
                }
              />
              <Text
                style={[
                  styles.suggestionText,
                  isMyPayment && styles.myPaymentText,
                  isMyReceiving && styles.myReceivingText,
                ]}
              >
                {actionText} {currencySymbol}
                {settlement.amount.toFixed(2)}
                {isMyPayment ? ' ← You need to pay' : ''}
                {isMyReceiving ? ' ← You will receive' : ''}
              </Text>
            </View>
          );
        })}
      </Card>
    );
  }, [suggestedSettlements, user, currencySymbol]);

  const renderSettlementHistory = useCallback(() => {
    const filteredSettlements = getFilteredSettlements();
    return (
      <Card style={styles.historyCard}>
        <Text style={styles.cardTitle}>Settlement History</Text>
        <View style={styles.filterTabRow}>
          {(['all', 'incoming', 'outgoing'] as const).map(type => (
            <TouchableOpacity
              key={type}
              style={[
                styles.filterTab,
                filterType === type && styles.filterTabActive,
              ]}
              onPress={() => setFilterType(type)}
            >
              <Text
                style={[
                  styles.filterTabText,
                  filterType === type && styles.filterTabTextActive,
                ]}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <FlatList
          data={filteredSettlements}
          renderItem={({ item }) => {
            const isOutgoing = item.fromUser === user?.id;
            // ✅ Convert settlement amount to display currency
            const displayAmt = convertAmount(
              item.amount,
              item.currency || 'USD',
            );
            return (
              <View style={styles.historyRow}>
                <View
                  style={[
                    styles.historyIconCircle,
                    {
                      backgroundColor: isOutgoing
                        ? Colors.negativeLight
                        : Colors.positiveLight,
                    },
                  ]}
                >
                  <Icon
                    name={isOutgoing ? 'arrow-upward' : 'arrow-downward'}
                    size={20}
                    color={isOutgoing ? Colors.negative : Colors.positive}
                  />
                </View>
                <View style={styles.historyInfo}>
                  <Text style={styles.historyTitleText}>
                    {getUserName(item.fromUser, user)} paid{' '}
                    {getUserName(item.toUser, user)}
                  </Text>
                  <Text style={styles.historyDateText}>
                    {new Date(item.date).toLocaleDateString()}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.historyAmountText,
                    { color: isOutgoing ? Colors.negative : Colors.positive },
                  ]}
                >
                  {isOutgoing ? '-' : '+'}
                  {currencySymbol}
                  {displayAmt.toFixed(2)}
                </Text>
              </View>
            );
          }}
          keyExtractor={item => item.id}
          scrollEnabled={false}
          ListEmptyComponent={
            <View style={styles.emptyHistoryContainer}>
              <Text style={styles.emptyHistoryText}>No settlements yet</Text>
            </View>
          }
        />
      </Card>
    );
  }, [filterType, getFilteredSettlements, user, currencySymbol, convertAmount]);

  return (
    <View style={styles.screenContainer}>
      <FlatList
        data={[{ key: 'balances' }, { key: 'suggestions' }, { key: 'history' }]}
        renderItem={({ item }) => {
          if (item.key === 'balances') return renderBalanceCard();
          if (item.key === 'suggestions') return renderSuggestedSettlements();
          return renderSettlementHistory();
        }}
        keyExtractor={item => item.key}
        showsVerticalScrollIndicator={false}
      />

      <Modal visible={showSettlementModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitleText}>Record Settlement</Text>
            <Text style={styles.modalSubtitleText}>
              {currentMyNet < -0.01
                ? `You are paying ${
                    selectedUser ? getUserName(selectedUser.userId, user) : ''
                  }`
                : `Recording payment from ${
                    selectedUser ? getUserName(selectedUser.userId, user) : ''
                  }`}
            </Text>
            <Text style={styles.amountFieldLabel}>Settlement Amount</Text>
            {/* ✅ Non-editable — fixed amount display */}
            <View style={styles.amountDisplayBox}>
              <Text style={styles.amountDisplayText}>
                {currencySymbol}
                {settlementAmount || '0.00'}
              </Text>
            </View>
            <View style={styles.modalButtonRow}>
              <Button
                title="Cancel"
                onPress={() => {
                  setShowSettlementModal(false);
                  setSelectedUser(null);
                  setSettlementAmount('');
                }}
                variant="outline"
                style={styles.modalActionButton}
              />
              <Button
                title="Confirm"
                onPress={handleCreateSettlement}
                style={styles.modalActionButton}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
