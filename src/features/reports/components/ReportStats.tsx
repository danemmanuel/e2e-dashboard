import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { StatusChip } from '../../../components/StatusChip.tsx';
import type { BranchStatus } from '../../projects/data/projects.ts';
import type { PlaywrightReportStats } from '../hooks/usePlaywrightReport.ts';
import { formatPercent, formatDurationMs } from '../../../utils/format.ts';

interface ReportStatsProps {
  stats: PlaywrightReportStats;
  passRate: number;
  status: BranchStatus;
}

export function ReportStats({ stats, passRate, status }: ReportStatsProps) {
  const summaryItems = [
    { label: 'Cenarios totais', value: stats.total },
    { label: 'Sucesso', value: stats.passed },
    { label: 'Falhas', value: stats.failed },
    { label: 'Skips', value: stats.skipped },
    { label: 'Flaky', value: stats.flaky },
  ];

  return (
    <Card>
      <CardContent>
        <Stack spacing={3}>
          <Stack
            direction='row'
            justifyContent='space-between'
            alignItems='center'
          >
            <Typography variant='h6'>Dados do Último Report</Typography>
            <StatusChip status={status} />
          </Stack>
          <Box
            sx={{
              display: 'grid',
              gap: 2,
              gridTemplateColumns: {
                xs: 'repeat(2, minmax(0, 1fr))',
                sm: 'repeat(3, minmax(0, 1fr))',
                md: 'repeat(5, minmax(0, 1fr))',
              },
            }}
          >
            <Stack spacing={0.5}>
              <Typography variant='overline' color='text.secondary'>
                Pass rate
              </Typography>
              <Typography variant='h4'>{formatPercent(passRate)}</Typography>
            </Stack>
            <Stack spacing={0.5}>
              <Typography variant='overline' color='text.secondary'>
                Duracao
              </Typography>
              <Typography variant='h5'>
                {formatDurationMs(stats.duration)}
              </Typography>
            </Stack>
            {summaryItems.map((item) => (
              <Stack spacing={0.5} key={item.label}>
                <Typography variant='overline' color='text.secondary'>
                  {item.label}
                </Typography>
                <Typography variant='h6'>{item.value}</Typography>
              </Stack>
            ))}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
