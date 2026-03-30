import {StyleSheet} from 'react-native';
import {Colors} from '../constants/colors';
import {Typography} from '../constants/typography';
import {Spacing} from '../constants/spacing';

export const commonStyles = StyleSheet.create({
  // Containers
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  surface: {
    backgroundColor: Colors.surface,
  },

  // Header
  screenHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: Spacing.lg,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },

  // Text
  textPrimary: {
    fontSize: Typography.md,
    color: Colors.textPrimary,
  },
  textSecondary: {
    fontSize: Typography.md,
    color: Colors.textSecondary,
  },
  textMuted: {
    fontSize: Typography.base,
    color: Colors.textMuted,
  },
  labelText: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    fontSize: Typography.xl,
    fontWeight: Typography.semiBold,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },

  // Balance colors
  positiveText: {
    color: Colors.positive,
  },
  negativeText: {
    color: Colors.negative,
  },
  neutralText: {
    color: Colors.neutral,
  },

  // Card
  card: {
    marginBottom: Spacing.md,
  },

  // Row
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  // Empty state
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: Typography.xl,
    fontWeight: Typography.medium,
    color: Colors.textMuted,
    marginTop: Spacing.lg,
  },
  emptySubtext: {
    fontSize: Typography.md,
    color: Colors.textLight,
    marginTop: Spacing.sm,
  },

  // Divider
  divider: {
    height: 1,
    backgroundColor: Colors.border,
  },

  // Modal
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
  },
  modalTitle: {
    fontSize: Typography.xxl,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  modalSubtitle: {
    fontSize: Typography.md,
    color: Colors.textSecondary,
    marginBottom: Spacing.xl,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  modalButton: {
    flex: 1,
  },
});