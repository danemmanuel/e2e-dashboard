import { format, formatDistanceToNow } from 'date-fns';

export function formatRelativeTime(value: string) {
  return formatDistanceToNow(new Date(value), { addSuffix: true });
}

export function formatDate(value: string, pattern = 'dd MMM yyyy HH:mm') {
  return format(new Date(value), pattern);
}

export function formatPercent(value: number) {
  return `${value.toFixed(0)}%`;
}

export function formatCoverage(passed: number, total: number) {
  if (!total) return '0%';
  return `${Math.round((passed / total) * 100)}%`;
}

export function formatDuration(minutes: number) {
  return `${minutes} min`;
}
