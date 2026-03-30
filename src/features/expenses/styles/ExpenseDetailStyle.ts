import { StyleSheet } from 'react-native';
import { Colors } from '../../../constants/colors';
import { Typography } from '../../../constants/typography';
import { Spacing } from '../../../constants/spacing';

export const styles = StyleSheet.create({
  screenContainer: { flex: 1, backgroundColor: Colors.background },
  notFoundText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: Typography.lg,
    color: Colors.textMuted,
  },

  headerCard: { alignItems: 'center', marginTop: Spacing.lg },
  amountText: {
    fontSize: Typography.hero,
    fontWeight: Typography.bold,
    color: Colors.primary,
    marginBottom: Spacing.sm,
  },
  descriptionText: {
    fontSize: Typography.xl,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  metaText: { fontSize: Typography.base, color: Colors.textMuted },

  // ── Location card ──
  locationCard: { marginTop: Spacing.lg },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  locationIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationTextWrap: { flex: 1 },
  locationShortName: {
    fontSize: Typography.md,
    fontWeight: Typography.semiBold,
    color: Colors.textPrimary,
  },
  locationFullName: {
    fontSize: Typography.base,
    color: Colors.textMuted,
    marginTop: 2,
  },
  locationHint: {
    fontSize: Typography.xs + 1,
    color: Colors.primary,
    marginTop: Spacing.sm,
    textAlign: 'right',
  },

  detailCard: { marginTop: Spacing.lg },
  sectionTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.semiBold,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
  },
  detailLabel: { fontSize: Typography.md, color: Colors.textSecondary },
  detailValue: {
    fontSize: Typography.md,
    color: Colors.textPrimary,
    fontWeight: Typography.medium,
  },

  splitsCard: { marginTop: Spacing.lg },
  splitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  splitUserName: {
    fontSize: Typography.md,
    color: Colors.textPrimary,
    flex: 1,
  },
  splitMetaText: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
    marginRight: Spacing.md,
  },
  splitAmountText: {
    fontSize: Typography.md,
    fontWeight: Typography.medium,
    color: Colors.primary,
  },

  actionsCard: { marginTop: Spacing.lg, marginBottom: Spacing.xxxl },
  actionButton: { marginBottom: Spacing.md },
  auditLogRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    marginTop: Spacing.sm,
  },
  auditLogLinkText: {
    fontSize: Typography.md,
    color: Colors.primary,
    marginLeft: Spacing.sm,
  },

  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: Colors.overlayDark,
  },
  modalCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: Spacing.xl,
    margin: Spacing.xl,
    maxHeight: '80%',
  },
  modalTitleText: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
  },
  auditEntry: {
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  auditTimeText: {
    fontSize: Typography.xs,
    color: Colors.textMuted,
    marginBottom: Spacing.xs,
  },
  auditChangeText: {
    fontSize: Typography.md,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  auditUserText: { fontSize: Typography.xs, color: Colors.textSecondary },
  auditEmptyText: {
    fontSize: Typography.md,
    color: Colors.textMuted,
    textAlign: 'center',
    paddingVertical: Spacing.xl,
  },
  closeButton: { marginTop: Spacing.lg },
});
