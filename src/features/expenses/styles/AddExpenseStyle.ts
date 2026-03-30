import { StyleSheet } from 'react-native';
import { Colors } from '../../../constants/colors';
import { Spacing } from '../../../constants/spacing';
import { Typography } from '../../../constants/typography';

export const styles = StyleSheet.create({
  screenContainer: { flex: 1, backgroundColor: Colors.background },
  formContainer: { padding: Spacing.xl },
  fieldLabel: {
    fontSize: Typography.md,
    fontWeight: Typography.medium,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
    marginTop: Spacing.lg,
  },
  optionalLabel: {
    fontSize: Typography.base,
    color: Colors.textMuted,
    fontWeight: '400',
  },

  // ── Location ──
  locationInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    gap: Spacing.sm,
  },
  locationInput: {
    flex: 1,
    fontSize: Typography.md,
    color: Colors.textPrimary,
    paddingVertical: Spacing.xs,
  },
  locationErrorText: {
    fontSize: Typography.base,
    color: Colors.negative,
    marginTop: Spacing.xs,
  },
  locationDropdown: {
    marginTop: 4,
    backgroundColor: Colors.surface,
    borderRadius: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    // ✅ zIndex ensures dropdown renders above other form elements
    zIndex: 999,
  },
  locationDropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: Spacing.sm,
  },
  locTextWrap: { flex: 1 },
  locShortName: {
    fontSize: Typography.md,
    color: Colors.textPrimary,
    fontWeight: Typography.medium,
  },
  locFullName: {
    fontSize: Typography.base,
    color: Colors.textMuted,
    marginTop: 2,
  },
  selectedLocationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primaryLight,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  selectedLocationText: {
    flex: 1,
    fontSize: Typography.md,
    color: Colors.primary,
    fontWeight: Typography.medium,
  },
  noResultsContainer: {
    padding: Spacing.md,
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: Typography.base,
    color: Colors.textMuted,
  },

  // ── Chips ──
  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  chip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipText: { fontSize: Typography.md, color: Colors.textPrimary },
  chipTextSelected: { color: Colors.surface, fontWeight: Typography.semiBold },

  // ── Split type ──
  splitTypeRow: { flexDirection: 'row', gap: Spacing.sm, flexWrap: 'wrap' },
  splitTypeChip: {
    flex: 1,
    minWidth: 70,
    alignItems: 'center',
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.sm,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  splitTypeChipSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  splitTypeIcon: { fontSize: 18, marginBottom: 2 },
  splitTypeLabel: {
    fontSize: Typography.xs + 1,
    color: Colors.textSecondary,
    fontWeight: Typography.medium,
  },
  splitTypeLabelSelected: {
    color: Colors.primary,
    fontWeight: Typography.semiBold,
  },
  splitTypeDisplay: {
    marginTop: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Spacing.md,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.sm,
  },
  equalBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xs,
    borderRadius: 20,
  },
  equalBadgeText: {
    fontSize: Typography.md,
    color: Colors.primary,
    fontWeight: Typography.semiBold,
  },
  splitInfoText: {
    fontSize: Typography.md,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  splitAmountHighlight: { color: Colors.primary, fontWeight: Typography.bold },

  // ── Custom split ──
  customSplitContainer: {
    marginTop: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Spacing.md,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.sm,
  },
  customSplitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: Spacing.sm,
  },
  customSplitName: {
    flex: 1,
    fontSize: Typography.md,
    color: Colors.textPrimary,
  },
  customSplitInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.sm,
    minWidth: 90,
  },
  customSplitInput: {
    fontSize: Typography.md,
    color: Colors.textPrimary,
    paddingVertical: Spacing.xs + 2,
    minWidth: 60,
    textAlign: 'right',
  },
  customSplitSuffix: {
    fontSize: Typography.base,
    color: Colors.textMuted,
    marginLeft: 2,
  },
  customSplitDerived: {
    fontSize: Typography.base,
    color: Colors.primary,
    fontWeight: Typography.semiBold,
    minWidth: 60,
    textAlign: 'right',
  },
  splitSummaryRow: { paddingTop: Spacing.sm, alignItems: 'flex-end' },
  splitSummaryText: {
    fontSize: Typography.base,
    fontWeight: Typography.medium,
  },
  splitSummaryOk: { color: Colors.positive },
  splitSummaryError: { color: Colors.negative },

  submitButton: { marginTop: Spacing.xxxl },
});
