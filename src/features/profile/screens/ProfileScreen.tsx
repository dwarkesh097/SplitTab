import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { Avatar } from '../../../components/common/Avatar';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import { Card } from '../../../components/common/Card';
import { RootState } from '../../../app/store';
import { logout, updateUser } from '../../../features/auth/authSlice';
import { AvatarColor, CurrencyCode } from '../../../models/user.types';
import { useCurrencyConverter } from '../../../hooks/useCurrencyConverter';
import { formatCurrency } from '../../../utils/currencyUtils';
import { AVATAR_COLORS, CURRENCY_LIST } from '../../../constants/currencies';
import { Colors } from '../../../constants/colors';
import { styles } from '../styles/ProfileStyle';

export const ProfileScreen: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { expenses } = useSelector((state: RootState) => state.expenses);
  const { settlements } = useSelector((state: RootState) => state.settlements);
  const { groups } = useSelector((state: RootState) => state.groups);
  const { convertAmount, currencySymbol } = useCurrencyConverter();

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [selectedColor, setSelectedColor] = useState<AvatarColor>(
    user?.avatarColor || (AVATAR_COLORS[0] as AvatarColor),
  );
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>(
    user?.displayCurrency || 'USD',
  );

  const stats = useMemo(() => {
    const totalPaid = expenses
      .filter(e => e.paidBy === user?.id)
      .reduce(
        (sum, e) => sum + convertAmount(e.amount, e.currency || 'USD'),
        0,
      );
    const totalSettled = settlements
      .filter(s => s.fromUser === user?.id)
      .reduce(
        (sum, s) => sum + convertAmount(s.amount, s.currency || 'USD'),
        0,
      );
    const activeGroups = groups.filter(g => !g.isArchived).length;
    return { totalPaid, totalSettled, activeGroups };
  }, [expenses, settlements, groups, user?.id, convertAmount]);

  const handleUpdateProfile = useCallback(() => {
    if (!user) return;
    dispatch(
      updateUser({
        name: editName,
        avatarColor: selectedColor,
        displayCurrency: selectedCurrency,
      }),
    );
    setIsEditing(false);
    Alert.alert('Success', 'Profile updated successfully');
  }, [dispatch, user, editName, selectedColor, selectedCurrency]);

  const handleLogout = useCallback(() => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => dispatch(logout()),
      },
    ]);
  }, [dispatch]);

  if (!user) return null;

  return (
    <ScrollView
      style={styles.screenContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.profileHeader}>
        <Avatar name={user.name} color={user.avatarColor} size="large" />
        {!isEditing && (
          <>
            <Text style={styles.profileNameText}>{user.name}</Text>
            <Text style={styles.profileEmailText}>{user.email}</Text>
            <TouchableOpacity
              style={styles.editProfileButton}
              onPress={() => setIsEditing(true)}
            >
              <Icon name="edit" size={20} color={Colors.primary} />
              <Text style={styles.editProfileText}>Edit Profile</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {isEditing && (
        <Card style={styles.editCard}>
          <Text style={styles.editCardTitle}>Edit Profile</Text>
          <Input
            label="Name"
            value={editName}
            onChangeText={setEditName}
            placeholder="Enter your name"
          />

          <Text style={styles.editSectionLabel}>Avatar Color</Text>
          <View style={styles.colorPickerGrid}>
            {AVATAR_COLORS.map(color => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorCircle,
                  { backgroundColor: color },
                  selectedColor === color && styles.colorCircleSelected,
                ]}
                onPress={() => setSelectedColor(color as AvatarColor)}
              />
            ))}
          </View>

          <Text style={styles.editSectionLabel}>Default Currency</Text>
          <View style={styles.currencyPickerRow}>
            {CURRENCY_LIST.map(currency => (
              <TouchableOpacity
                key={currency.code}
                style={[
                  styles.currencyOption,
                  selectedCurrency === currency.code &&
                    styles.currencyOptionSelected,
                ]}
                onPress={() => setSelectedCurrency(currency.code)}
              >
                <Text style={styles.currencySymbolText}>{currency.symbol}</Text>
                <Text style={styles.currencyNameText}>{currency.name}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.editActionRow}>
            <Button
              title="Cancel"
              onPress={() => setIsEditing(false)}
              variant="outline"
              style={styles.editCancelButton}
            />
            <Button title="Save Changes" onPress={handleUpdateProfile} />
          </View>
        </Card>
      )}

      <Card style={styles.statsCard}>
        <Text style={styles.statsCardTitle}>Your Statistics</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValueText}>
              {formatCurrency(stats.totalPaid, currencySymbol)}
            </Text>
            <Text style={styles.statLabelText}>Total Paid</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValueText}>
              {formatCurrency(stats.totalSettled, currencySymbol)}
            </Text>
            <Text style={styles.statLabelText}>Total Settled</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValueText}>{stats.activeGroups}</Text>
            <Text style={styles.statLabelText}>Active Groups</Text>
          </View>
        </View>
      </Card>

      <Button
        title="Logout"
        onPress={handleLogout}
        variant="danger"
        style={styles.logoutButton}
      />
    </ScrollView>
  );
};
