import React, { useMemo, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Svg, {
  Rect,
  G,
  Text as SvgText,
  Line,
  Circle,
  Path,
} from 'react-native-svg';

import { Card } from '../../../components/common/Card';
import { RootState } from '../../../app/store';
import { useCurrencyConverter } from '../../../hooks/useCurrencyConverter';
import { CATEGORY_COLORS } from '../../../constants/categories';
import { Colors } from '../../../constants/colors';
import { Typography } from '../../../constants/typography';
import { Spacing } from '../../../constants/spacing';
import { fetchExpenses } from '../../../features/expenses/expenseSlice';
import { fetchSettlements } from '../../../features/settlements/settlementSlice';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHART_WIDTH = SCREEN_WIDTH - 64;
const CHART_HEIGHT = 250;

interface CategoryDataItem {
  name: string;
  amount: number;
  color: string;
  percentage: number;
}

interface MonthlyDataItem {
  month: string;
  amount: number;
}

export const AnalyticsScreen: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { groups } = useSelector((state: RootState) => state.groups);
  const { expenses } = useSelector((state: RootState) => state.expenses);
  const { settlements } = useSelector((state: RootState) => state.settlements);
  const { convertAmount, currencySymbol } = useCurrencyConverter();

  useEffect(() => {
    groups.forEach(group => {
      dispatch(fetchExpenses(group.id) as any);
      dispatch(fetchSettlements(group.id) as any);
    });
  }, [groups, dispatch]);

  const allExpenses = useMemo(() => expenses, [expenses]);

  const allSettlements = useMemo(() => settlements, [settlements]);

  const { totalPaid, totalOwedToMe, totalIOwe } = useMemo(() => {
    let paid = 0;
    let owedToMe = 0;
    let iOwe = 0;

    allExpenses.forEach(expense => {
      const expCurrency = expense.currency || 'USD';
      if (expense.paidBy === user?.id) {
        paid += convertAmount(expense.amount, expCurrency);
      }
    });

    groups.forEach(group => {
      const groupExpenses = allExpenses.filter(e => e.groupId === group.id);
      const groupSettlements = allSettlements.filter(
        s => s.groupId === group.id,
      );

      let net = 0;

      groupExpenses.forEach(expense => {
        const expCurrency = expense.currency || 'USD';
        if (expense.paidBy === user?.id) {
          net += convertAmount(expense.amount, expCurrency);
        }
        const mySplit = expense.splits?.find(s => s.userId === user?.id);
        if (mySplit) {
          net -= convertAmount(mySplit.amount, expCurrency);
        }
      });

      groupSettlements.forEach(s => {
        const sCurrency = s.currency || 'USD';
        const amt = convertAmount(s.amount, sCurrency);
        if (s.fromUser === user?.id) net += amt;
        if (s.toUser === user?.id) net -= amt;
      });

      if (net > 0.01) owedToMe += net;
      else if (net < -0.01) iOwe += Math.abs(net);
    });

    return {
      totalPaid: Math.max(0, paid),
      totalOwedToMe: Math.max(0, owedToMe),
      totalIOwe: Math.max(0, iOwe),
    };
  }, [allExpenses, allSettlements, groups, user?.id, convertAmount]);

  const monthlyData = useMemo((): MonthlyDataItem[] => {
    const now = new Date();
    const months: { monthKey: string; monthLabel: string; amount: number }[] =
      [];

    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        monthKey: `${date.getFullYear()}-${date.getMonth()}`,
        monthLabel: date.toLocaleString('default', { month: 'short' }),
        amount: 0,
      });
    }

    allExpenses.forEach(expense => {
      const expDate = new Date(expense.date);
      const expKey = `${expDate.getFullYear()}-${expDate.getMonth()}`;
      const found = months.find(m => m.monthKey === expKey);
      if (!found) return;

      const expCurrency = expense.currency || 'USD';

      const mySplit = expense.splits?.find(s => s.userId === user?.id);
      if (mySplit) {
        found.amount += convertAmount(mySplit.amount, expCurrency);
      }
    });

    return months.map(m => ({ month: m.monthLabel, amount: m.amount }));
  }, [allExpenses, user?.id, convertAmount]);

  const categoryData = useMemo((): CategoryDataItem[] => {
    const now = new Date();

    const categoryTotals: Record<string, number> = {
      Food: 0,
      Travel: 0,
      Utilities: 0,
      Entertainment: 0,
      Other: 0,
    };

    allExpenses.forEach(expense => {
      const expDate = new Date(expense.date);
      const isCurrentMonth =
        expDate.getMonth() === now.getMonth() &&
        expDate.getFullYear() === now.getFullYear();

      if (!isCurrentMonth) return;

      const mySplit = expense.splits?.find(s => s.userId === user?.id);
      if (!mySplit) return;

      const expCurrency = expense.currency || 'USD';
      const myAmount = convertAmount(mySplit.amount, expCurrency);
      const cat = expense.category ?? 'Other';

      if (categoryTotals[cat] !== undefined) {
        categoryTotals[cat] += myAmount;
      } else {
        categoryTotals['Other'] += myAmount;
      }
    });

    const total = Object.values(categoryTotals).reduce((a, b) => a + b, 0);
    if (total === 0) return [];

    return Object.entries(categoryTotals)
      .filter(([, amount]) => amount > 0)
      .map(([name, amount]) => ({
        name,
        amount,
        color:
          CATEGORY_COLORS[name as keyof typeof CATEGORY_COLORS] ??
          Colors.textMuted,
        percentage: parseFloat(((amount / total) * 100).toFixed(1)),
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [allExpenses, user?.id, convertAmount]);

  const topCategory = categoryData.length > 0 ? categoryData[0].name : '';

  // ─────────────────────────────────────────────
  // CHARTS
  // ─────────────────────────────────────────────

  const renderBarChart = useCallback(() => {
    if (monthlyData.every(d => d.amount === 0)) {
      return (
        <View style={styles.emptyChartContainer}>
          <Text style={styles.emptyChartText}>No expense data yet</Text>
        </View>
      );
    }

    const maxAmount = Math.max(...monthlyData.map(d => d.amount), 1);
    const barWidth = (CHART_WIDTH - 40) / monthlyData.length - 8;

    return (
      <View style={styles.chartContainer}>
        <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
          {[0, 0.25, 0.5, 0.75, 1].map((tick, index) => {
            const y = CHART_HEIGHT - 40 - tick * (CHART_HEIGHT - 60);
            const labelValue = Math.round(maxAmount * tick);
            return (
              <G key={`grid-${index}`}>
                <Line
                  x1={30}
                  y1={y}
                  x2={CHART_WIDTH}
                  y2={y}
                  stroke={Colors.border}
                  strokeWidth={1}
                />
                <SvgText
                  x={25}
                  y={y + 4}
                  fontSize={9}
                  fill={Colors.textMuted}
                  textAnchor="end"
                >
                  {`${currencySymbol}${labelValue}`}
                </SvgText>
              </G>
            );
          })}

          {monthlyData.map((data, index) => {
            const barHeight = (data.amount / maxAmount) * (CHART_HEIGHT - 60);
            const x = 30 + index * (barWidth + 8);
            const y = CHART_HEIGHT - 40 - barHeight;
            return (
              <G key={`bar-${index}`}>
                <Rect
                  x={x}
                  y={barHeight > 0 ? y : CHART_HEIGHT - 42}
                  width={barWidth}
                  height={barHeight > 0 ? barHeight : 2}
                  fill={barHeight > 0 ? Colors.primary : Colors.border}
                  rx={4}
                />
                <SvgText
                  x={x + barWidth / 2}
                  y={CHART_HEIGHT - 22}
                  fontSize={10}
                  fill={Colors.textSecondary}
                  textAnchor="middle"
                >
                  {data.month}
                </SvgText>
                {barHeight > 15 && (
                  <SvgText
                    x={x + barWidth / 2}
                    y={y - 6}
                    fontSize={10}
                    fill={Colors.textPrimary}
                    textAnchor="middle"
                    fontWeight="600"
                  >
                    {`${currencySymbol}${Math.round(data.amount)}`}
                  </SvgText>
                )}
              </G>
            );
          })}
        </Svg>
      </View>
    );
  }, [monthlyData, currencySymbol]);

  const renderDoughnutChart = useCallback(() => {
    if (categoryData.length === 0) {
      return (
        <View style={styles.emptyChartContainer}>
          <Text style={styles.emptyChartText}>No data for current month</Text>
        </View>
      );
    }

    const radius = 80;
    const centerX = CHART_WIDTH / 2;
    const centerY = 110;
    const totalAmount = categoryData.reduce((s, c) => s + c.amount, 0);

    // ✅ Single category — full circle directly
    const renderSlices = () => {
      if (categoryData.length === 1) {
        return (
          <Circle
            cx={centerX}
            cy={centerY}
            r={radius}
            fill={categoryData[0].color}
            stroke={Colors.surface}
            strokeWidth={2}
          />
        );
      }

      let currentAngle = -90;
      return categoryData.map((category, index) => {
        const sweepAngle = (category.percentage / 100) * 360;
        const endAngle = currentAngle + sweepAngle;
        const startRad = (currentAngle * Math.PI) / 180;
        const endRad = (endAngle * Math.PI) / 180;
        const x1 = centerX + radius * Math.cos(startRad);
        const y1 = centerY + radius * Math.sin(startRad);
        const x2 = centerX + radius * Math.cos(endRad);
        const y2 = centerY + radius * Math.sin(endRad);
        const largeArcFlag = sweepAngle > 180 ? 1 : 0;
        const path = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
        currentAngle = endAngle;
        return (
          <Path
            key={`slice-${index}`}
            d={path}
            fill={category.color}
            stroke={Colors.surface}
            strokeWidth={2}
          />
        );
      });
    };

    return (
      <View style={styles.doughnutContainer}>
        <Svg width={CHART_WIDTH} height={220}>
          {renderSlices()}
          <Circle
            cx={centerX}
            cy={centerY}
            r={radius * 0.55}
            fill={Colors.surface}
          />
          <SvgText
            x={centerX}
            y={centerY - 8}
            fontSize={13}
            fontWeight="bold"
            fill={Colors.textPrimary}
            textAnchor="middle"
          >
            My Share
          </SvgText>
          <SvgText
            x={centerX}
            y={centerY + 12}
            fontSize={13}
            fill={Colors.textSecondary}
            textAnchor="middle"
          >
            {`${currencySymbol}${totalAmount.toFixed(0)}`}
          </SvgText>
        </Svg>
      </View>
    );
  }, [categoryData, currencySymbol]);

  return (
    <ScrollView style={styles.screenContainer}>
      {/* ── Summary Card ── */}
      <Card style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total Paid</Text>
            <Text style={[styles.summaryValue, styles.paidValueText]}>
              {`${currencySymbol}${totalPaid.toFixed(2)}`}
            </Text>
            <Text style={styles.summaryHint}>You paid upfront</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Owed To You</Text>
            <Text style={[styles.summaryValue, styles.owedToMeValueText]}>
              {`${currencySymbol}${totalOwedToMe.toFixed(2)}`}
            </Text>
            <Text style={styles.summaryHint}>Others owe you</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>You Owe</Text>
            <Text style={[styles.summaryValue, styles.youOweValueText]}>
              {`${currencySymbol}${totalIOwe.toFixed(2)}`}
            </Text>
            <Text style={styles.summaryHint}>Across all groups</Text>
          </View>
        </View>
      </Card>

      {/* ── Monthly Spend ── */}
      <Card style={styles.chartCard}>
        <Text style={styles.chartTitle}>My Monthly Spend</Text>
        <Text style={styles.chartSubtitle}>
          Your share of expenses — last 6 months
        </Text>
        {renderBarChart()}
      </Card>

      {/* ── Category Breakdown ── */}
      <Card style={styles.chartCard}>
        <Text style={styles.chartTitle}>Category Breakdown</Text>
        <Text style={styles.chartSubtitle}>Your share this month</Text>
        {renderDoughnutChart()}
        {categoryData.length > 0 && (
          <View style={styles.legendContainer}>
            {categoryData.map(category => (
              <View key={category.name} style={styles.legendItem}>
                <View
                  style={[
                    styles.legendColorDot,
                    { backgroundColor: category.color },
                  ]}
                />
                <Text style={styles.legendItemText}>
                  {category.name} ({category.percentage}%) — {currencySymbol}
                  {category.amount.toFixed(2)}
                </Text>
              </View>
            ))}
          </View>
        )}
      </Card>

      {/* ── Top Category ── */}
      {topCategory !== '' && (
        <Card style={styles.topCategoryCard}>
          <Text style={styles.topCategoryLabel}>Top Spending Category</Text>
          <Text style={styles.topCategoryValue}>{topCategory}</Text>
          <Text style={styles.topCategoryHint}>
            Your highest spending category this month
          </Text>
        </Card>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screenContainer: { flex: 1, backgroundColor: Colors.background },
  summaryCard: { marginTop: Spacing.xl },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
    paddingVertical: Spacing.xs,
  },
  summaryLabel: {
    fontSize: Typography.xs + 2,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  summaryValue: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    textAlign: 'center',
  },
  summaryHint: {
    fontSize: Typography.xs,
    color: Colors.textMuted,
    marginTop: 2,
    textAlign: 'center',
  },
  paidValueText: { color: Colors.primary },
  owedToMeValueText: { color: Colors.positive },
  youOweValueText: { color: Colors.negative },
  summaryDivider: { width: 1, height: 50, backgroundColor: Colors.border },
  chartCard: { marginTop: Spacing.lg },
  chartTitle: {
    fontSize: Typography.xl,
    fontWeight: Typography.semiBold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  chartSubtitle: {
    fontSize: Typography.base,
    color: Colors.textMuted,
    marginBottom: Spacing.xl,
  },
  chartContainer: { alignItems: 'center', paddingVertical: 10 },
  doughnutContainer: { alignItems: 'center' },
  legendContainer: {
    marginTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.sm,
  },
  legendColorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: Spacing.xs + 2,
  },
  legendItemText: { fontSize: Typography.base, color: Colors.textSecondary },
  topCategoryCard: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.xxxl,
    alignItems: 'center',
    backgroundColor: Colors.primary,
  },
  topCategoryLabel: {
    fontSize: Typography.md,
    color: Colors.surface,
    opacity: 0.9,
    marginBottom: Spacing.sm,
  },
  topCategoryValue: {
    fontSize: 28,
    fontWeight: Typography.bold,
    color: Colors.surface,
    marginBottom: Spacing.sm,
  },
  topCategoryHint: {
    fontSize: Typography.base,
    color: Colors.surface,
    opacity: 0.8,
    textAlign: 'center',
  },
  emptyChartContainer: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyChartText: { fontSize: Typography.md, color: Colors.textMuted },
});
