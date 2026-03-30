import { StyleSheet } from 'react-native';
import { Colors } from '../../../constants/colors';
import { Typography } from '../../../constants/typography';
import { Spacing } from '../../../constants/spacing';

export const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  keyboardContainer: {
    flex: 1,
  },
  headerSection: {
    alignItems: 'center',
    paddingVertical: 50,
    backgroundColor: Colors.primary,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: {
    fontSize: 36,
    fontWeight: Typography.bold,
    color: Colors.surface,
    marginBottom: Spacing.xs,
  },
  headerSubtitle: {
    fontSize: Typography.lg,
    color: Colors.surface,
    opacity: 0.9,
  },
  formSection: {
    padding: Spacing.xl,
    paddingTop: Spacing.xxxl,
  },
  formTitle: {
    fontSize: Typography.xxxl,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  formSubtitle: {
    fontSize: Typography.md,
    color: Colors.textSecondary,
    marginBottom: Spacing.xxl,
  },
  errorBox: {
    backgroundColor: Colors.negativeLight,
    padding: Spacing.md,
    borderRadius: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  errorBoxText: {
    color: Colors.negative,
    fontSize: Typography.md,
    textAlign: 'center',
  },
  signInButton: {
    marginTop: Spacing.md,
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.xl,
  },
  registerPromptText: {
    fontSize: Typography.md,
    color: Colors.textSecondary,
  },
  registerLinkText: {
    fontSize: Typography.md,
    color: Colors.primary,
    fontWeight: Typography.semiBold,
  },
  demoAccountsText: {
    textAlign: 'center',
    fontSize: Typography.base,
    color: Colors.textMuted,
    marginTop: Spacing.xl,
    lineHeight: 20,
  },
});
