import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';

import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { RootState } from '../../../app/store';
import { fetchGroups, deleteGroup } from '../../../features/groups/groupSlice';
import { Group } from '../../../models/group.types';
import { getBalanceType } from '../../../utils/currencyUtils';
import { useCurrencyConverter } from '../../../hooks/useCurrencyConverter';
import { Colors } from '../../../constants/colors';
import { Typography } from '../../../constants/typography';
import { Spacing } from '../../../constants/spacing';
import { RootStackParamList } from '../../../navigation/types';
import { styles } from '../styles/GroupsStyle';

type GroupsNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Groups'
>;

interface Props {
  navigation: GroupsNavigationProp;
}

export const GroupsScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useDispatch();
  const { groups, isLoading } = useSelector((state: RootState) => state.groups);
  const { expenses, expensesByGroup } = useSelector(
    (state: RootState) => state.expenses,
  );
  const { settlements } = useSelector((state: RootState) => state.settlements);
  const { user } = useSelector((state: RootState) => state.auth);
  const { currencySymbol, convertAmount } = useCurrencyConverter();
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchGroups() as any);
    }, [dispatch]),
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await dispatch(fetchGroups() as any);
    setRefreshing(false);
  }, [dispatch]);

  const getUserBalance = useCallback(
    (group: Group): number => {
      const groupExpenses =
        expensesByGroup?.[group.id] ??
        expenses.filter(e => e.groupId === group.id);
      const groupSettlements = settlements.filter(s => s.groupId === group.id);

      let net = 0;
      groupExpenses.forEach(expense => {
        const expCurrency = expense.currency || 'USD';
        if (expense.paidBy === user?.id) {
          net += convertAmount(expense.amount, expCurrency);
        }
        const split = expense.splits?.find(s => s.userId === user?.id);
        if (split) {
          net -= convertAmount(split.amount, expCurrency);
        }
      });
      groupSettlements.forEach(s => {
        const sCurrency = s.currency || 'USD';
        if (s.fromUser === user?.id) net += convertAmount(s.amount, sCurrency);
        if (s.toUser === user?.id) net -= convertAmount(s.amount, sCurrency);
      });

      return Math.round(net * 100) / 100;
    },
    [expenses, expensesByGroup, settlements, user?.id, convertAmount],
  );

  const getGroupTotalSpend = useCallback(
    (group: Group): number => {
      const groupExpenses =
        expensesByGroup?.[group.id] ??
        expenses.filter(e => e.groupId === group.id);
      return groupExpenses.reduce((sum, expense) => {
        return sum + convertAmount(expense.amount, expense.currency || 'USD');
      }, 0);
    },
    [expenses, expensesByGroup, convertAmount],
  );

  const getBalanceStyle = useCallback((balance: number) => {
    const type = getBalanceType(balance);
    switch (type) {
      case 'positive':
        return styles.positiveBalance;
      case 'negative':
        return styles.negativeBalance;
      default:
        return styles.neutralBalance;
    }
  }, []);

  const formatBalanceDisplay = useCallback(
    (balance: number): string => {
      const abs = Math.abs(balance);
      if (balance > 0) return `+${currencySymbol}${abs.toFixed(2)}`;
      if (balance < 0) return `-${currencySymbol}${abs.toFixed(2)}`;
      return `${currencySymbol}0.00`;
    },
    [currencySymbol],
  );

  const handleDeleteGroup = useCallback(
    (groupId: string, groupName: string) => {
      Alert.alert(
        'Delete Group',
        `Are you sure you want to delete "${groupName}"? This action cannot be undone.`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => {
              dispatch(deleteGroup(groupId));
            },
          },
        ],
      );
    },
    [dispatch],
  );

  const renderGroup = useCallback(
    ({ item }: { item: Group }) => {
      const userBalance = getUserBalance(item);
      const totalSpend = getGroupTotalSpend(item);

      return (
        <Card
          style={styles.groupCard}
          onPress={() =>
            navigation.navigate('GroupDetail', { groupId: item.id })
          }
        >
          <View style={styles.groupCardHeader}>
            <Text style={styles.groupIconText}>{item.icon}</Text>
            <View style={styles.groupInfoContainer}>
              <Text style={styles.groupNameText}>{item.name}</Text>
              <Text style={styles.groupDescriptionText}>
                {item.members.length} members
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => handleDeleteGroup(item.id, item.name)}
              style={styles.deleteIconButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Icon name="delete-outline" size={22} color={Colors.negative} />
            </TouchableOpacity>
          </View>

          <View style={styles.groupCardFooter}>
            <View>
              <Text style={styles.totalSpendLabel}>Total Spend</Text>
              <Text style={styles.totalSpendAmount}>
                {`${currencySymbol}${totalSpend.toFixed(0)}`}
              </Text>
            </View>
            <View style={styles.balanceSection}>
              <Text style={styles.balanceLabel}>Your Balance</Text>
              <Text
                style={[styles.balanceAmount, getBalanceStyle(userBalance)]}
              >
                {formatBalanceDisplay(userBalance)}
              </Text>
            </View>
          </View>

          <Text style={styles.lastActivityText}>
            Last activity: {new Date(item.lastActivity).toLocaleDateString()}
          </Text>
        </Card>
      );
    },
    [
      getUserBalance,
      getGroupTotalSpend,
      currencySymbol,
      formatBalanceDisplay,
      getBalanceStyle,
      handleDeleteGroup,
      navigation,
    ],
  );

  const ListEmptyComponent = useCallback(
    () => (
      <View style={styles.emptyStateContainer}>
        <Icon name="people" size={64} color={Colors.textLight} />
        <Text style={styles.emptyStateTitle}>No groups yet</Text>
        <Text style={styles.emptyStateSubtitle}>
          Create your first group to get started
        </Text>
      </View>
    ),
    [],
  );

  return (
    <View style={styles.screenContainer}>
      <View style={styles.topHeader}>
        <Button
          title="+ Create Group"
          onPress={() => navigation.navigate('AddGroup')}
        />
      </View>

      <FlatList
        data={groups}
        renderItem={renderGroup}
        keyExtractor={item => item.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing || isLoading}
            onRefresh={onRefresh}
          />
        }
        ListEmptyComponent={ListEmptyComponent}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

