import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import DateTimePicker from '@react-native-community/datetimepicker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Input } from '../../../components/common/Input';
import { Button } from '../../../components/common/Button';
import {
  createExpense,
  updateExpense,
} from '../../../features/expenses/expenseSlice';
import { RootState } from '../../../app/store';
import { ExpenseCategory, SplitType } from '../../../models/expense.types';
import { getUserName } from '../../../utils/userUtils';
import { CATEGORIES } from '../../../constants/categories';
import { Colors } from '../../../constants/colors';
import { RootStackParamList } from '../../../navigation/types';
import {
  LocationResult,
  useLocationSearch,
} from '../../../hooks/Uselocationsearch';
import { styles } from '../styles/AddExpenseStyle';

type Props = NativeStackScreenProps<RootStackParamList, 'AddExpense'>;

interface FormData {
  description: string;
  amount: string;
  date: string;
  category: ExpenseCategory;
  paidBy: string;
}

const schema = yup.object({
  description: yup.string().required('Description is required'),
  amount: yup
    .string()
    .required('Amount is required')
    .test('is-positive', 'Amount must be positive', val => {
      const num = parseFloat(val || '0');
      return !isNaN(num) && num > 0;
    }),
  date: yup.string().required('Date is required'),
  category: yup.string().required('Category is required'),
  paidBy: yup.string().required('Please select who paid'),
});

const SPLIT_TYPE_OPTIONS: { key: SplitType; label: string; icon: string }[] = [
  { key: 'EQUAL', label: 'Equal', icon: '⚖️' },
  { key: 'EXACT', label: 'Exact', icon: '💯' },
  { key: 'PERCENTAGE', label: 'Percentage', icon: '%' },
  { key: 'SHARES', label: 'Shares', icon: '🔢' },
];

function buildSplits(
  splitType: SplitType,
  members: string[],
  totalAmount: number,
  customValues: Record<string, string>,
) {
  switch (splitType) {
    case 'EQUAL': {
      const per = parseFloat((totalAmount / members.length).toFixed(2));
      return members.map(id => ({ userId: id, amount: per }));
    }
    case 'EXACT':
      return members.map(id => ({
        userId: id,
        amount: parseFloat(customValues[id] || '0'),
      }));
    case 'PERCENTAGE':
      return members.map(id => {
        const pct = parseFloat(customValues[id] || '0');
        return {
          userId: id,
          amount: parseFloat(((pct / 100) * totalAmount).toFixed(2)),
          percentage: pct,
        };
      });
    case 'SHARES': {
      const totalShares = members.reduce(
        (sum, id) => sum + parseFloat(customValues[id] || '1'),
        0,
      );
      return members.map(id => {
        const shares = parseFloat(customValues[id] || '1');
        return {
          userId: id,
          amount: parseFloat(
            ((shares / (totalShares || 1)) * totalAmount).toFixed(2),
          ),
          shares,
        };
      });
    }
  }
}

function validateSplits(
  splitType: SplitType,
  members: string[],
  totalAmount: number,
  customValues: Record<string, string>,
): string | null {
  if (splitType === 'EXACT') {
    const sum = members.reduce(
      (s, id) => s + parseFloat(customValues[id] || '0'),
      0,
    );
    if (Math.abs(sum - totalAmount) > 0.02)
      return `Exact amounts must sum to ${totalAmount.toFixed(
        2,
      )} (currently ${sum.toFixed(2)})`;
  }
  if (splitType === 'PERCENTAGE') {
    const sum = members.reduce(
      (s, id) => s + parseFloat(customValues[id] || '0'),
      0,
    );
    if (Math.abs(sum - 100) > 0.01)
      return `Percentages must sum to 100% (currently ${sum.toFixed(1)}%)`;
  }
  if (splitType === 'SHARES') {
    if (members.some(id => parseFloat(customValues[id] || '0') <= 0))
      return 'All shares must be greater than 0';
  }
  return null;
}

export const AddExpenseScreen: React.FC<Props> = ({ route, navigation }) => {
  const { groupId, expenseId, isEditing } = route.params;
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { currentGroup } = useSelector((state: RootState) => state.groups);
  const { expenses } = useSelector((state: RootState) => state.expenses);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // ── Split state ──
  const [selectedSplitType, setSelectedSplitType] =
    useState<SplitType>('EQUAL');
  const [customValues, setCustomValues] = useState<Record<string, string>>({});

  // ── Location state ──
  const [selectedLocation, setSelectedLocation] =
    useState<LocationResult | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const {
    query,
    setQuery,
    results,
    isLoading: locationLoading,
    error: locationError,
    clearResults,
  } = useLocationSearch();

  const groupMembers = currentGroup?.members || [];
  const existingExpense =
    isEditing && expenseId ? expenses.find(e => e.id === expenseId) : null;

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      description: existingExpense?.description || '',
      amount: existingExpense ? existingExpense.amount.toString() : '',
      date: existingExpense?.date || new Date().toISOString().split('T')[0],
      category: existingExpense?.category || 'Food',
      paidBy: existingExpense?.paidBy || user?.id || '',
    },
  });

  useEffect(() => {
    if (existingExpense?.location) {
      setSelectedLocation(existingExpense.location);
    }
  }, []);

  const amount = parseFloat(watch('amount') || '0');

  useEffect(() => {
    if (selectedSplitType === 'EQUAL') {
      setCustomValues({});
      return;
    }
    const d: Record<string, string> = {};
    if (selectedSplitType === 'PERCENTAGE') {
      const eq = (100 / (groupMembers.length || 1)).toFixed(1);
      groupMembers.forEach(id => (d[id] = eq));
    } else if (selectedSplitType === 'SHARES') {
      groupMembers.forEach(id => (d[id] = '1'));
    } else {
      const per =
        amount > 0 ? (amount / (groupMembers.length || 1)).toFixed(2) : '0';
      groupMembers.forEach(id => (d[id] = per));
    }
    setCustomValues(d);
  }, [selectedSplitType]);

  const equalPerPerson =
    amount > 0 && groupMembers.length > 0
      ? (amount / groupMembers.length).toFixed(2)
      : '—';

  const getSplitSummary = useCallback((): string => {
    if (selectedSplitType === 'PERCENTAGE') {
      const sum = groupMembers.reduce(
        (s, id) => s + parseFloat(customValues[id] || '0'),
        0,
      );
      return `Total: ${sum.toFixed(1)}% ${
        Math.abs(sum - 100) < 0.01 ? '✓' : '(must be 100%)'
      }`;
    }
    if (selectedSplitType === 'EXACT') {
      const sum = groupMembers.reduce(
        (s, id) => s + parseFloat(customValues[id] || '0'),
        0,
      );
      return `Total: ${sum.toFixed(2)} ${
        amount > 0 && Math.abs(sum - amount) < 0.02
          ? '✓'
          : `(must be ${amount.toFixed(2)})`
      }`;
    }
    if (selectedSplitType === 'SHARES') {
      const total = groupMembers.reduce(
        (s, id) => s + parseFloat(customValues[id] || '0'),
        0,
      );
      return `Total shares: ${total}`;
    }
    return '';
  }, [selectedSplitType, customValues, groupMembers, amount]);

  // ─────────────────────────────────────────────
  // Location handlers
  // ─────────────────────────────────────────────

  const handleSelectLocation = useCallback(
    (loc: LocationResult) => {
      setSelectedLocation(loc);
      setShowDropdown(false);
      clearResults();
    },
    [clearResults],
  );

  const handleClearLocation = useCallback(() => {
    setSelectedLocation(null);
    clearResults();
    setShowDropdown(false);
  }, [clearResults]);

  // ── Form submit ──
  const onSubmit = (data: FormData) => {
    console.log('selectedLocation at submit:', selectedLocation);
    const parsedAmount = parseFloat(data.amount);
    const splitError = validateSplits(
      selectedSplitType,
      groupMembers,
      parsedAmount,
      customValues,
    );
    if (splitError) {
      Alert.alert('Invalid Split', splitError);
      return;
    }

    const splits = buildSplits(
      selectedSplitType,
      groupMembers,
      parsedAmount,
      customValues,
    );

    const locationPayload = selectedLocation ?? undefined;

    if (isEditing && existingExpense) {
      dispatch(
        updateExpense({
          id: existingExpense.id,
          updates: {
            description: data.description,
            amount: parsedAmount,
            date: data.date,
            category: data.category,
            paidBy: data.paidBy,
            splitType: selectedSplitType,
            splits,
            location: locationPayload,
            updatedAt: new Date().toISOString(),
          },
          modifiedBy: user?.id || '',
        }) as any,
      );
      Alert.alert('Success', 'Expense updated successfully', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } else {
      dispatch(
        createExpense({
          groupId,
          amount: parsedAmount,
          currency: user?.displayCurrency || 'USD',
          description: data.description,
          date: data.date,
          category: data.category,
          paidBy: data.paidBy,
          splitType: selectedSplitType,
          splits,
          location: locationPayload,
          createdBy: user?.id || '',
        }) as any,
      );
      navigation.goBack();
    }
  };

  // ─────────────────────────────────────────────
  // Location section UI
  // ─────────────────────────────────────────────
  const renderLocationSection = () => {
    console.log('renderLocationSection called');
    console.log('selectedLocation:', selectedLocation);
    console.log('query:', query);
    console.log('results:', results);

    return (
      <View style={{ marginTop: 16 }}>
        <Text
          style={{ fontSize: 16, color: Colors.textPrimary, marginBottom: 8 }}
        >
          Location <Text style={{ color: Colors.textMuted }}>(Optional)</Text>
        </Text>

        {selectedLocation ? (
          // ── Selected pill ──
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: Colors.primaryLight,
              borderWidth: 1,
              borderColor: Colors.primary,
              borderRadius: 8,
              paddingHorizontal: 12,
              paddingVertical: 10,
            }}
          >
            <Text style={{ color: Colors.primary, marginRight: 6 }}>📍</Text>
            <Text
              style={{ flex: 1, color: Colors.primary, fontSize: 15 }}
              numberOfLines={1}
            >
              {selectedLocation.shortName}
            </Text>
            <TouchableOpacity onPress={() => setSelectedLocation(null)}>
              <Text style={{ color: Colors.textMuted, fontSize: 18 }}>✕</Text>
            </TouchableOpacity>
          </View>
        ) : (
          // ── Search input ──
          <View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: Colors.surface,
                borderWidth: 1,
                borderColor: Colors.border,
                borderRadius: 8,
                paddingHorizontal: 12,
                paddingVertical: 8,
              }}
            >
              <Text style={{ color: Colors.textMuted, marginRight: 6 }}>
                🔍
              </Text>
              <TextInput
                style={{
                  flex: 1,
                  fontSize: 15,
                  color: Colors.textPrimary,
                  paddingVertical: 4,
                }}
                value={query}
                onChangeText={text => {
                  setQuery(text);
                  setShowDropdown(text.trim().length >= 2);
                }}
                placeholder="Search for a place..."
                placeholderTextColor={Colors.textMuted}
                autoCorrect={false}
                autoCapitalize="none"
              />
              {locationLoading && (
                <ActivityIndicator size="small" color={Colors.primary} />
              )}
              {!locationLoading && query.length > 0 && (
                <TouchableOpacity
                  onPress={() => {
                    setQuery('');
                    clearResults();
                    setShowDropdown(false);
                  }}
                >
                  <Text style={{ color: Colors.textMuted, fontSize: 16 }}>
                    ✕
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {!!locationError && (
              <Text
                style={{ color: Colors.negative, fontSize: 13, marginTop: 4 }}
              >
                {locationError}
              </Text>
            )}

            {showDropdown && results.length > 0 && (
              <View
                style={{
                  marginTop: 4,
                  backgroundColor: Colors.surface,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: Colors.border,
                  elevation: 6,
                  zIndex: 999,
                }}
              >
                {results.map((loc, idx) => (
                  <TouchableOpacity
                    key={loc.place_id}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: 12,
                      borderBottomWidth: idx === results.length - 1 ? 0 : 1,
                      borderBottomColor: Colors.border,
                    }}
                    onPress={() => {
                      setSelectedLocation(loc);
                      setShowDropdown(false);
                      clearResults();
                    }}
                  >
                    <Text style={{ color: Colors.primary, marginRight: 8 }}>
                      📍
                    </Text>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 15,
                          color: Colors.textPrimary,
                          fontWeight: '500',
                        }}
                        numberOfLines={1}
                      >
                        {loc.shortName}
                      </Text>
                      <Text
                        style={{
                          fontSize: 13,
                          color: Colors.textMuted,
                          marginTop: 2,
                        }}
                        numberOfLines={1}
                      >
                        {loc.display_name}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        )}
      </View>
    );
  };

  // ─────────────────────────────────────────────
  // Custom split inputs (Exact / % / Shares)
  // ─────────────────────────────────────────────
  const renderCustomSplitInputs = () => {
    if (selectedSplitType === 'EQUAL') return null;
    const placeholder =
      selectedSplitType === 'PERCENTAGE'
        ? '%'
        : selectedSplitType === 'SHARES'
        ? 'shares'
        : 'amount';
    const suffix =
      selectedSplitType === 'PERCENTAGE'
        ? '%'
        : selectedSplitType === 'SHARES'
        ? ' shares'
        : '';

    return (
      <View style={styles.customSplitContainer}>
        {groupMembers.map(memberId => {
          const val = customValues[memberId] || '';
          let derived = '';
          if (selectedSplitType === 'SHARES' && amount > 0) {
            const total = groupMembers.reduce(
              (s, id) => s + parseFloat(customValues[id] || '0'),
              0,
            );
            derived =
              total > 0
                ? `= ${((parseFloat(val || '0') / total) * amount).toFixed(2)}`
                : '= 0.00';
          }
          if (selectedSplitType === 'PERCENTAGE' && amount > 0) {
            derived = `= ${((parseFloat(val || '0') / 100) * amount).toFixed(
              2,
            )}`;
          }
          return (
            <View key={memberId} style={styles.customSplitRow}>
              <Text style={styles.customSplitName}>
                {getUserName(memberId, user)}
              </Text>
              <View style={styles.customSplitInputWrap}>
                <TextInput
                  style={styles.customSplitInput}
                  value={val}
                  onChangeText={text => {
                    const dotCount = (text.match(/\./g) || []).length;
                    if (text.length <= 9 && dotCount <= 1)
                      setCustomValues(prev => ({ ...prev, [memberId]: text }));
                  }}
                  keyboardType="decimal-pad"
                  maxLength={9}
                  placeholder={placeholder}
                  placeholderTextColor={Colors.textMuted}
                />
                {suffix !== '' && (
                  <Text style={styles.customSplitSuffix}>{suffix}</Text>
                )}
              </View>
              {derived !== '' && (
                <Text style={styles.customSplitDerived}>{derived}</Text>
              )}
            </View>
          );
        })}
        <View style={styles.splitSummaryRow}>
          <Text
            style={[
              styles.splitSummaryText,
              getSplitSummary().includes('must')
                ? styles.splitSummaryError
                : styles.splitSummaryOk,
            ]}
          >
            {getSplitSummary()}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <ScrollView
      style={styles.screenContainer}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.formContainer}>
        {/* Description */}
        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <Input
              label="Description"
              placeholder="What was this for?"
              value={value}
              onChangeText={onChange}
              error={error?.message}
            />
          )}
        />

        {/* Amount */}
        <Controller
          control={control}
          name="amount"
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <Input
              label="Amount"
              placeholder="0.00"
              value={value}
              onChangeText={text => {
                if (text.length <= 9 && (text.match(/\./g) || []).length <= 1)
                  onChange(text);
              }}
              keyboardType="decimal-pad"
              maxLength={9}
              error={error?.message}
            />
          )}
        />

        {/* Date */}
        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
          <Controller
            control={control}
            name="date"
            render={({ field: { value }, fieldState: { error } }) => (
              <Input
                label="Date"
                value={value}
                editable={false}
                pointerEvents="none"
                error={error?.message}
              />
            )}
          />
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={new Date(watch('date'))}
            mode="date"
            onChange={(_, d) => {
              setShowDatePicker(false);
              if (d) setValue('date', d.toISOString().split('T')[0]);
            }}
          />
        )}

        {renderLocationSection()}

        <Text style={styles.fieldLabel}>Category</Text>
        <View style={styles.chipGrid}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.chip,
                watch('category') === cat && styles.chipSelected,
              ]}
              onPress={() => setValue('category', cat)}
            >
              <Text
                style={[
                  styles.chipText,
                  watch('category') === cat && styles.chipTextSelected,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Paid By */}
        <Text style={styles.fieldLabel}>Paid By</Text>
        <View style={styles.chipGrid}>
          {groupMembers.map((id: string) => (
            <TouchableOpacity
              key={id}
              style={[
                styles.chip,
                watch('paidBy') === id && styles.chipSelected,
              ]}
              onPress={() => setValue('paidBy', id)}
            >
              <Text
                style={[
                  styles.chipText,
                  watch('paidBy') === id && styles.chipTextSelected,
                ]}
              >
                {getUserName(id, user)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Split Type */}
        <Text style={styles.fieldLabel}>Split Type</Text>
        <View style={styles.splitTypeRow}>
          {SPLIT_TYPE_OPTIONS.map(opt => (
            <TouchableOpacity
              key={opt.key}
              style={[
                styles.splitTypeChip,
                selectedSplitType === opt.key && styles.splitTypeChipSelected,
              ]}
              onPress={() => setSelectedSplitType(opt.key)}
            >
              <Text style={styles.splitTypeIcon}>{opt.icon}</Text>
              <Text
                style={[
                  styles.splitTypeLabel,
                  selectedSplitType === opt.key &&
                    styles.splitTypeLabelSelected,
                ]}
              >
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Equal split display */}
        {selectedSplitType === 'EQUAL' && (
          <View style={styles.splitTypeDisplay}>
            <View style={styles.equalBadge}>
              <Text style={styles.equalBadgeText}>⚖️ Equal Split</Text>
            </View>
            <Text style={styles.splitInfoText}>
              Each member pays{' '}
              <Text style={styles.splitAmountHighlight}>
                {amount > 0 && groupMembers.length > 0 ? equalPerPerson : '—'}
              </Text>
              {amount > 0 && groupMembers.length > 0
                ? ` (${groupMembers.length} members)`
                : ''}
            </Text>
          </View>
        )}

        {renderCustomSplitInputs()}

        <Button
          title={isEditing ? 'Update Expense' : 'Add Expense'}
          onPress={handleSubmit(onSubmit)}
          style={styles.submitButton}
        />
      </View>
    </ScrollView>
  );
};


