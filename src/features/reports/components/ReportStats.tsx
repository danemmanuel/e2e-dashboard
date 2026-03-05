import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { jsPDF } from 'jspdf';
import { StatusChip } from '../../../components/StatusChip.tsx';
import type { BranchStatus } from '../../projects/data/projects.ts';
import type {
  PlaywrightReportStats,
  PlaywrightReportTest,
} from '../hooks/usePlaywrightReport.ts';
import { formatPercent, formatDurationMs } from '../../../utils/format.ts';

interface ReportStatsProps {
  stats: PlaywrightReportStats;
  passRate: number;
  status: BranchStatus;
  tests?: PlaywrightReportTest[];
}

export function ReportStats({ stats, passRate, status, tests }: ReportStatsProps) {
  const summaryItems = [
    { label: 'Cenarios totais', value: stats.total },
    { label: 'Sucesso', value: stats.passed },
    { label: 'Falhas', value: stats.failed },
    { label: 'Skips', value: stats.skipped },
    { label: 'Flaky', value: stats.flaky },
  ];

  const handleGeneratePdf = () => {
    const doc = new jsPDF();
    const margin = 14;
    let cursorY = margin;
    const pageHeight = doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.getWidth();

    const ensureSpace = (height = 8) => {
      if (cursorY + height > pageHeight - margin) {
        doc.addPage();
        cursorY = margin;
      }
    };

    const addTextBlock = (text: string, options?: { bold?: boolean }) => {
      ensureSpace();
      if (options?.bold) {
        doc.setFont('helvetica', 'bold');
      } else {
        doc.setFont('helvetica', 'normal');
      }
      doc.text(text, margin, cursorY);
      cursorY += 8;
    };

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Relatorio de Testes E2E', margin, cursorY);
    cursorY += 12;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    addTextBlock(`Pass rate: ${formatPercent(passRate)}`);
    addTextBlock(`Status: ${status}`);
    addTextBlock(`Duracao total: ${formatDurationMs(stats.duration)}`);

    doc.setFontSize(12);
    addTextBlock('Resumo', { bold: true });
    doc.setFontSize(11);
    summaryItems.forEach((item) => {
      addTextBlock(`${item.label}: ${item.value}`);
    });

    doc.setFontSize(12);
    addTextBlock('Testes', { bold: true });
    doc.setFontSize(10);

    if (tests?.length) {
      tests.forEach((test, index) => {
        ensureSpace(16);
        doc.setFont('helvetica', 'bold');
        doc.text(`${index + 1}. ${test.fullTitle || test.title}`, margin, cursorY);
        cursorY += 6;

        doc.setFont('helvetica', 'normal');
        addTextBlock(
          `Status: ${test.status} | Duracao: ${formatDurationMs(
            test.durationMs
          )} | Retries: ${test.retries}`
        );

        if (test.errorMessage) {
          const errorLines = doc.splitTextToSize(
            `Erro: ${test.errorMessage}`,
            pageWidth - margin * 2
          );
          errorLines.forEach((line) => addTextBlock(line));
        }
      });
    } else {
      addTextBlock('Nenhum teste encontrado.');
    }

    doc.save('report-playwright.pdf');
  };

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
            <Stack direction='row' spacing={1} alignItems='center'>
              <Button variant='outlined' size='small' onClick={handleGeneratePdf}>
                Gerar PDF
              </Button>
              <StatusChip status={status} />
            </Stack>
          </Stack>
          <Box
            sx={{
              display: 'grid',
              gap: 1,
              gridTemplateColumns: {
                xs: 'repeat(2, minmax(0, 1fr))',
                sm: 'repeat(3, minmax(0, 1fr))',
                md: 'repeat(5, minmax(0, 1fr))',
              },
            }}
          >
            <Stack spacing={0}>
              <Typography variant='overline' color='text.secondary'>
                Pass rate
              </Typography>
              <Typography variant='h4'>{formatPercent(passRate)}</Typography>
            </Stack>
            <Stack spacing={0}>
              <Typography variant='overline' color='text.secondary'>
                Duracao
              </Typography>
              <Typography variant='h5'>
                {formatDurationMs(stats.duration)}
              </Typography>
            </Stack>
            {summaryItems.map((item) => (
              <Stack spacing={0} key={item.label}>
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
