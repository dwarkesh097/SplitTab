import { StyleSheet } from 'react-native';
import { Colors } from '../../../constants/colors';
import { Spacing } from '../../../constants/spacing';
import { Typography } from '../../../constants/typography';

export const styles = StyleSheet.create({
  screenContainer: { flex: 1, backgroundColor: Colors.background },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: Spacing.section,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  profileNameText: {
    fontSize: Typography.xxxl,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    marginTop: Spacing.md,
  },
  profileEmailText: {
    fontSize: Typography.md,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  editProfileText: {
    color: Colors.primary,
    marginLeft: Spacing.xs,
    fontSize: Typography.md,
  },
  editCard: { marginTop: Spacing.xl },
  editCardTitle: {
    fontSize: Typography.xl,
    fontWeight: Typography.semiBold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xl,
  },
  editSectionLabel: {
    fontSize: Typography.md,
    fontWeight: Typography.medium,
    color: Colors.textPrimary,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  colorPickerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing.sm,
  },
  colorCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorCircleSelected: { borderColor: Colors.primary, borderWidth: 3 },
  currencyPickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  currencyOption: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    alignItems: 'center',
  },
  currencyOptionSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  currencySymbolText: {
    fontSize: Typography.xxl,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  currencyNameText: {
    fontSize: Typography.xs + 1,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  editActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.xl,
  },
  editCancelButton: { marginRight: Spacing.md },
  statsCard: { marginTop: Spacing.xl },
  statsCardTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.semiBold,
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statItem: { flex: 1, alignItems: 'center' },
  statValueText: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.primary,
  },
  statLabelText: {
    fontSize: Typography.xs + 2,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
  statDivider: { width: 1, height: 40, backgroundColor: Colors.border },
  logoutButton: { margin: Spacing.xl },
});
