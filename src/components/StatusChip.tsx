import { Chip } from '@mui/material';
import type { BranchStatus } from '../features/projects/data/projects.ts';

const STATUS_META: Record<
  BranchStatus,
  { label: string; color: 'success' | 'warning' | 'error' }
> = {
  passing: { label: 'Sucesso', color: 'success' },
  unstable: { label: 'Instável', color: 'warning' },
  failing: { label: 'Falhando', color: 'error' },
};

interface StatusChipProps {
  status: BranchStatus;
}

export function StatusChip({ status }: StatusChipProps) {
  const meta = STATUS_META[status];

  return (
    <Chip
      label={meta.label}
      color={meta.color}
      variant='outlined'
      size='small'
    />
  );
}
