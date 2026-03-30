import { StyleSheet } from "react-native";
import { Colors } from "../../../constants/colors";
import { Spacing } from "../../../constants/spacing";
import { Typography } from "../../../constants/typography";

export const styles = StyleSheet.create({
  screenContainer: { flex: 1, backgroundColor: Colors.background },
  topHeader: {
    padding: Spacing.lg,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    alignItems: 'flex-end',
  },

  listContent: {
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xl,
    flexGrow: 1,
  },
  groupCard: { marginBottom: Spacing.md },
  groupCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  groupIconText: { fontSize: 40, marginRight: Spacing.md },
  groupInfoContainer: { flex: 1 },
  groupNameText: {
    fontSize: Typography.xl,
    fontWeight: Typography.semiBold,
    color: Colors.textPrimary,
  },
  groupDescriptionText: {
    fontSize: Typography.md,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  deleteIconButton: { padding: Spacing.sm },
  groupCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  totalSpendLabel: { fontSize: Typography.base, color: Colors.textSecondary },
  totalSpendAmount: {
    fontSize: Typography.xl,
    fontWeight: Typography.semiBold,
    color: Colors.textPrimary,
    marginTop: Spacing.xs,
  },
  balanceSection: { alignItems: 'flex-end' },
  balanceLabel: { fontSize: Typography.base, color: Colors.textSecondary },
  balanceAmount: {
    fontSize: Typography.xl,
    fontWeight: Typography.semiBold,
    marginTop: Spacing.xs,
  },
  positiveBalance: { color: Colors.positive },
  negativeBalance: { color: Colors.negative },
  neutralBalance: { color: Colors.neutral },
  lastActivityText: {
    fontSize: Typography.base,
    color: Colors.textMuted,
    marginTop: Spacing.sm,
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
    flex: 1,
  },
  emptyStateTitle: {
    fontSize: Typography.xl,
    fontWeight: Typography.medium,
    color: Colors.textMuted,
    marginTop: Spacing.lg,
  },
  emptyStateSubtitle: {
    fontSize: Typography.md,
    color: Colors.textLight,
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
});