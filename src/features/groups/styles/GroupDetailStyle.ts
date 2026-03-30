import { StyleSheet } from 'react-native';
import { Colors } from '../../../constants/colors';
import { Spacing } from '../../../constants/spacing';
import { Typography } from '../../../constants/typography';

export const styles = StyleSheet.create({
  screenContainer: { flex: 1, backgroundColor: Colors.background },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  groupHeader: {
    backgroundColor: Colors.surface,
    padding: Spacing.xl,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  groupIconEmoji: { fontSize: 48, marginBottom: Spacing.md },
  groupNameText: {
    fontSize: Typography.xxxl,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  groupDescriptionText: {
    fontSize: Typography.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  memberCountText: { fontSize: Typography.base, color: Colors.textMuted },
  balanceCard: { margin: Spacing.lg, marginBottom: 0 },
  balanceCardTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.semiBold,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  noBalanceText: {
    fontSize: Typography.md,
    color: Colors.textMuted,
    textAlign: 'center',
    paddingVertical: Spacing.md,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  balanceUserName: { fontSize: Typography.md, color: Colors.textSecondary },
  balanceValue: { fontSize: Typography.lg, fontWeight: Typography.semiBold },
  positiveText: { color: Colors.positive },
  negativeText: { color: Colors.negative },
  settledText: { color: Colors.textMuted, fontSize: Typography.md },
  settleUpButton: { marginTop: Spacing.lg },
  activitySection: { marginTop: Spacing.lg, marginBottom: Spacing.xxxl },
  activitySectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  activitySectionTitle: {
    fontSize: Typography.xl,
    fontWeight: Typography.semiBold,
    color: Colors.textPrimary,
  },
  activityCard: { marginHorizontal: Spacing.lg, marginBottom: Spacing.sm },
  activityRow: { flexDirection: 'row', alignItems: 'center' },
  activityContent: { flex: 1, marginLeft: Spacing.md },
  activityTitle: {
    fontSize: Typography.md,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  activityAmount: {
    fontSize: Typography.lg,
    fontWeight: Typography.semiBold,
    color: Colors.primary,
  },
  activityTime: {
    fontSize: Typography.base,
    color: Colors.textMuted,
    marginTop: Spacing.sm,
  },
  emptyActivityContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.section,
  },
  emptyActivityText: {
    fontSize: Typography.lg,
    color: Colors.textMuted,
    marginBottom: Spacing.sm,
  },
  emptyActivitySubtext: { fontSize: Typography.md, color: Colors.textLight },
});
