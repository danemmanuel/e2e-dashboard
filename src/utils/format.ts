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

export function formatDurationMs(ms: number) {
  if (!ms) return '0 s';
  if (ms < 1000) return `${ms} ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)} s`;
  const minutes = ms / 60000;
  return minutes >= 10
    ? `${Math.round(minutes)} min`
    : `${minutes.toFixed(1)} min`;
}
