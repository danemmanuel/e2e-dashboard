import {
  Card,
  CardContent,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import type { PlaywrightReportTest } from '../hooks/usePlaywrightReport.ts';
import { formatDurationMs } from '../../../utils/format.ts';

const STATUS_COLOR: Record<
  string,
  'default' | 'success' | 'error' | 'warning' | 'info'
> = {
  passed: 'success',
  failed: 'error',
  flaky: 'warning',
  skipped: 'info',
};

interface ReportTestsTableProps {
  tests: PlaywrightReportTest[];
}

export function ReportTestsTable({ tests }: ReportTestsTableProps) {
  if (!tests.length) {
    return null;
  }

  return (
    <Card>
      <CardContent sx={{ overflowX: 'auto' }}>
        <Typography variant='h6' gutterBottom>
          Casos executados ({tests.length})
        </Typography>
        <Table size='small'>
          <TableHead>
            <TableRow>
              <TableCell>Caso</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Duração</TableCell>
              <TableCell>Tentativas</TableCell>
              <TableCell>Erro</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tests.map((test) => (
              <TableRow key={test.id} hover>
                <TableCell>{test.fullTitle}</TableCell>
                <TableCell>
                  <Chip
                    label={test.status}
                    size='small'
                    color={STATUS_COLOR[test.status] ?? 'default'}
                  />
                </TableCell>
                <TableCell>{formatDurationMs(test.durationMs)}</TableCell>
                <TableCell>{test.retries + 1}</TableCell>
                <TableCell>
                  {test.errorMessage ? (
                    <Typography variant='caption' color='error'>
                      {test.errorMessage}
                    </Typography>
                  ) : (
                    <Typography variant='caption' color='text.secondary'>
                      sem erros
                    </Typography>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
