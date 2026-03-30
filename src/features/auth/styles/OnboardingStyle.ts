import { StyleSheet } from 'react-native';
import { Colors } from '../../../constants/colors';
import { Spacing } from '../../../constants/spacing';
import { Typography } from '../../../constants/typography';

export const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  headerSection: {
    alignItems: 'center',
    paddingVertical: Spacing.section,
    backgroundColor: Colors.primary,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: {
    fontSize: Typography.display,
    fontWeight: Typography.bold,
    color: Colors.surface,
    marginBottom: Spacing.sm,
  },
  headerSubtitle: {
    fontSize: Typography.lg,
    color: Colors.surface,
    opacity: 0.9,
  },
  formSection: {
    padding: Spacing.xl,
  },
  sectionLabel: {
    fontSize: Typography.lg,
    fontWeight: Typography.semiBold,
    color: Colors.textPrimary,
    marginTop: Spacing.xl,
    marginBottom: Spacing.md,
  },
  colorPickerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  colorCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorCircleSelected: {
    borderColor: Colors.primary,
    borderWidth: 3,
  },
  currencyPickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.md,
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
    fontSize: Typography.xxl + 2,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  currencyNameText: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  previewSection: {
    alignItems: 'center',
    marginTop: Spacing.xxxl,
    padding: Spacing.xl,
    backgroundColor: Colors.background,
    borderRadius: Spacing.md,
  },
  previewLabel: {
    fontSize: Typography.md,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  previewNameText: {
    fontSize: Typography.xl,
    fontWeight: Typography.semiBold,
    color: Colors.textPrimary,
    marginTop: Spacing.sm,
  },
  previewEmailText: {
    fontSize: Typography.md,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  submitButton: {
    marginTop: Spacing.xxxl,
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  loginPromptText: {
    fontSize: Typography.md,
    color: Colors.textSecondary,
  },
  loginLinkText: {
    fontSize: Typography.md,
    color: Colors.primary,
    fontWeight: Typography.semiBold,
  },
});