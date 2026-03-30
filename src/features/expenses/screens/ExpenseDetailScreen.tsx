import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  Linking,
  Platform,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { RootState } from '../../../app/store';
import { deleteExpense } from '../../../features/expenses/expenseSlice';
import { getUserName } from '../../../utils/userUtils';
import { formatCurrency } from '../../../utils/currencyUtils';
import { Colors } from '../../../constants/colors';
import { RootStackParamList } from '../../../navigation/types';
import { styles } from '../styles/ExpenseDetailStyle';

type Props = NativeStackScreenProps<RootStackParamList, 'ExpenseDetail'>;

function openMapsApp(lat: string, lon: string, label: string) {
  const encoded = encodeURIComponent(label);

  const url = Platform.select({
    ios: `maps:${lat},${lon}?q=${encoded}`,
    android: `geo:${lat},${lon}?q=${lat},${lon}(${encoded})`,
  });

  if (!url) return;

  Linking.canOpenURL(url)
    .then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        // ✅ Fallback: Google Maps web URL works universally
        const webUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;
        Linking.openURL(webUrl);
      }
    })
    .catch(() => {
      // ✅ Any error — still fallback to web maps
      const webUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;
      Linking.openURL(webUrl);
    });
}

export const ExpenseDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { expenseId, groupId } = route.params;
  const dispatch = useDispatch();
  const { expenses } = useSelector((state: RootState) => state.expenses);
  const { user } = useSelector((state: RootState) => state.auth);
  const [showAuditLog, setShowAuditLog] = useState(false);

  const expense = expenses.find(e => e.id === expenseId);
  console.log('expense.location:', expense?.location);

  if (!expense) {
    return (
      <View style={styles.screenContainer}>
        <Text style={styles.notFoundText}>Expense not found</Text>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert('Delete Expense', 'Are you sure? This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          dispatch(deleteExpense(expenseId) as any);
          navigation.goBack();
        },
      },
    ]);
  };

  const getSplitTypeLabel = () => {
    switch (expense.splitType) {
      case 'EQUAL':
        return 'Split equally';
      case 'EXACT':
        return 'Split by exact amounts';
      case 'PERCENTAGE':
        return 'Split by percentage';
      case 'SHARES':
        return 'Split by shares';
      default:
        return expense.splitType;
    }
  };

  return (
    <ScrollView style={styles.screenContainer}>
      {/* ── Header card ── */}
      <Card style={styles.headerCard}>
        <Text style={styles.amountText}>
          {formatCurrency(expense.amount, expense.currency)}
        </Text>
        <Text style={styles.descriptionText}>{expense.description}</Text>
        <View style={styles.metaRow}>
          <Icon name="category" size={16} color={Colors.textMuted} />
          <Text style={styles.metaText}>{expense.category}</Text>
          <Icon name="calendar-today" size={16} color={Colors.textMuted} />
          <Text style={styles.metaText}>
            {new Date(expense.date).toLocaleDateString()}
          </Text>
        </View>
      </Card>

      {/* ── Location card — only rendered when expense has a location tag ── */}
      {expense.location && (
        <Card style={styles.locationCard}>
          {/*
           * ✅ Tapping opens native maps with the stored lat/lon.
           * openMapsApp() handles iOS (Apple Maps), Android (Google Maps),
           * and falls back to Google Maps web if native app is not installed.
           */}
          <TouchableOpacity
            style={styles.locationRow}
            onPress={() =>
              openMapsApp(
                expense.location!.lat,
                expense.location!.lon,
                expense.location!.shortName,
              )
            }
            activeOpacity={0.7}
          >
            <View style={styles.locationIconWrap}>
              <Icon name="location-on" size={20} color={Colors.primary} />
            </View>
            <View style={styles.locationTextWrap}>
              {/* Short readable name (first 2 parts of display_name) */}
              <Text style={styles.locationShortName} numberOfLines={1}>
                {expense.location.shortName}
              </Text>
              {/* Full Nominatim display_name as subtitle */}
              <Text style={styles.locationFullName} numberOfLines={2}>
                {expense.location.display_name}
              </Text>
            </View>
            {/* External link icon hints that tapping opens maps */}
            <Icon name="open-in-new" size={16} color={Colors.textMuted} />
          </TouchableOpacity>
          <Text style={styles.locationHint}>Tap to open in Maps</Text>
        </Card>
      )}

      {/* ── Details card ── */}
      <Card style={styles.detailCard}>
        <Text style={styles.sectionTitle}>Details</Text>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Paid by:</Text>
          <Text style={styles.detailValue}>
            {getUserName(expense.paidBy, user)}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Split type:</Text>
          <Text style={styles.detailValue}>{getSplitTypeLabel()}</Text>
        </View>
      </Card>

      {/* ── Split breakdown ── */}
      <Card style={styles.splitsCard}>
        <Text style={styles.sectionTitle}>Split Breakdown</Text>
        {expense.splits.map((split, index) => (
          <View key={index} style={styles.splitRow}>
            <Text style={styles.splitUserName}>
              {getUserName(split.userId, user)}
            </Text>
            {expense.splitType === 'PERCENTAGE' && (
              <Text style={styles.splitMetaText}>{split.percentage}%</Text>
            )}
            {expense.splitType === 'SHARES' && (
              <Text style={styles.splitMetaText}>{split.shares} shares</Text>
            )}
            <Text style={styles.splitAmountText}>
              {formatCurrency(split.amount, expense.currency)}
            </Text>
          </View>
        ))}
      </Card>

      {/* ── Actions ── */}
      <Card style={styles.actionsCard}>
        <Button
          title="Edit Expense"
          onPress={() =>
            navigation.navigate('AddExpense', {
              groupId,
              expenseId,
              isEditing: true,
            })
          }
          variant="outline"
          style={styles.actionButton}
        />
        <Button
          title="Delete Expense"
          onPress={handleDelete}
          variant="danger"
          style={styles.actionButton}
        />
        <TouchableOpacity
          onPress={() => setShowAuditLog(true)}
          style={styles.auditLogRow}
        >
          <Icon name="history" size={20} color={Colors.primary} />
          <Text style={styles.auditLogLinkText}>View Audit Log</Text>
        </TouchableOpacity>
      </Card>

      {/* ── Audit log modal ── */}
      <Modal visible={showAuditLog} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitleText}>Audit Log</Text>
            <ScrollView>
              {expense.auditLog?.length ? (
                expense.auditLog.map((entry, index) => (
                  <View key={index} style={styles.auditEntry}>
                    <Text style={styles.auditTimeText}>
                      {new Date(entry.timestamp).toLocaleString()}
                    </Text>
                    <Text style={styles.auditChangeText}>
                      Changed {entry.field}: {String(entry.oldValue)} →{' '}
                      {String(entry.newValue)}
                    </Text>
                    <Text style={styles.auditUserText}>
                      by {getUserName(entry.modifiedBy, user)}
                    </Text>
                  </View>
                ))
              ) : (
                <Text style={styles.auditEmptyText}>No audit history</Text>
              )}
            </ScrollView>
            <Button
              title="Close"
              onPress={() => setShowAuditLog(false)}
              style={styles.closeButton}
            />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};


