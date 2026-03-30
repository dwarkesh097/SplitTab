import { StyleSheet } from "react-native";
import { Colors } from "../../../constants/colors";
import { Spacing } from "../../../constants/spacing";
import { Typography } from "../../../constants/typography";

export const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  formContainer: {
    padding: Spacing.xl,
  },
  sectionLabel: {
    fontSize: Typography.lg,
    fontWeight: Typography.medium,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  iconGridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing.xxl,
  },
  iconOption: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  iconOptionSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  iconEmoji: {
    fontSize: 32,
  },
  searchInputContainer: {
    marginBottom: Spacing.md,
  },
  membersListContainer: {
    maxHeight: 400,
    marginBottom: Spacing.xl,
  },
  selectedCountText: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: Spacing.sm,
    marginBottom: Spacing.sm,
    backgroundColor: Colors.background,
  },
  memberRowSelected: {
    backgroundColor: Colors.primaryLight,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  memberRowCurrentUser: {
    opacity: 0.7,
  },
  memberAvatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  memberInitialText: {
    color: Colors.surface,
    fontSize: Typography.lg,
    fontWeight: Typography.semiBold,
  },
  memberInfoContainer: {
    flex: 1,
  },
  memberNameText: {
    fontSize: Typography.md,
    fontWeight: Typography.medium,
    color: Colors.textPrimary,
  },
  memberEmailText: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  submitButton: {
    marginTop: Spacing.xl,
  },
});