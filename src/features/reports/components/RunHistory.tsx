import {
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import { StatusChip } from '../../../components/StatusChip.tsx';
import { formatDate, formatDuration } from '../../../utils/format.ts';
import type { BranchRun } from '../../projects/data/projects.ts';

interface RunHistoryProps {
  runs: BranchRun[];
}

export function RunHistory({ runs }: RunHistoryProps) {
  const orderedRuns = [...runs].sort(
    (a, b) =>
      new Date(b.executedAt).getTime() - new Date(a.executedAt).getTime()
  );

  return (
    <Card>
      <CardContent>
        <Stack spacing={3}>
          <Stack
            direction='row'
            justifyContent='space-between'
            alignItems='center'
          >
            <Typography variant='h6'>Histórico de execuções</Typography>
            <Chip label={`${orderedRuns.length} últimas runs`} size='small' />
          </Stack>
          <Divider />
          <Stack spacing={3}>
            {orderedRuns.map((run) => (
              <Stack
                key={run.id}
                spacing={1}
                sx={{ borderLeft: '3px solid', borderColor: 'divider', pl: 2 }}
              >
                <Stack direction='row' spacing={1.5} alignItems='center'>
                  <Typography variant='subtitle2'>
                    {formatDate(run.executedAt, 'dd MMM yyyy · HH:mm')}
                  </Typography>
                  <StatusChip status={run.status} />
                </Stack>
                <Typography variant='body2' color='text.secondary'>
                  Pass rate {run.passRate}% ·{' '}
                  {formatDuration(run.durationMinutes)} · {run.failedScenarios}{' '}
                  cenários falharam
                </Typography>
                <Typography variant='caption' color='text.secondary'>
                  Total executado: {run.totalScenarios}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
