export function buildShortName(displayName: string): string {
  const parts = displayName.split(',').map(s => s.trim());
  return parts.slice(0, 2).join(', ');
}