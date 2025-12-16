import { useEffect, useMemo, useState } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  List,
  ListItemButton,
  ListItemText,
  ListSubheader,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import type {
  PlaywrightReportSpec,
  PlaywrightReportTest,
  PlaywrightTestStatus,
} from '../hooks/usePlaywrightReport.ts';
import { formatDurationMs } from '../../../utils/format.ts';

interface ReportDetailsProps {
  specs: PlaywrightReportSpec[];
  tests: PlaywrightReportTest[];
  attachmentsBasePath?: string;
  reportSrc: string;
}

type TestStatusFilter = PlaywrightTestStatus | 'all';
type AttemptStatus = PlaywrightReportTest['attempts'][number]['status'];

type StatusMeta = {
  label: string;
  color: 'default' | 'success' | 'warning' | 'error' | 'info';
};

const STATUS_META: Record<PlaywrightTestStatus, StatusMeta> = {
  passed: { label: 'Sucesso', color: 'success' },
  failed: { label: 'Falha', color: 'error' },
  flaky: { label: 'Flaky', color: 'warning' },
  skipped: { label: 'Ignorado', color: 'info' },
};

const ATTEMPT_META: Record<AttemptStatus, StatusMeta> = {
  passed: STATUS_META.passed,
  failed: STATUS_META.failed,
  skipped: STATUS_META.skipped,
  timedOut: { label: 'Timeout', color: 'warning' },
  interrupted: { label: 'Interrompido', color: 'warning' },
  crashed: { label: 'Crash', color: 'error' },
};

const ANSI_REGEX = /\u001B\[[0-9;]*m/g;

function buildPlaywrightTestUrl(baseUrl: string, testId?: string) {
  if (!testId) {
    return baseUrl;
  }

  const [withoutHash] = baseUrl.split('#');
  const normalizedId = testId.replace(/^.+?(508f5f)/, '$1');
  const encoded = encodeURIComponent(normalizedId);

  return `${withoutHash}#?testId=${encoded}`;
}

type SpecWithFilteredTests = PlaywrightReportSpec & {
  tests: PlaywrightReportTest[];
};

type SpecGroup = {
  id: string;
  label: string;
  specs: SpecWithFilteredTests[];
};

export function ReportDetails({
  specs,
  tests,
  reportSrc,
  attachmentsBasePath,
}: ReportDetailsProps) {
  const [statusFilter, setStatusFilter] = useState<TestStatusFilter>('all');
  const [query, setQuery] = useState('');
  const [selectedTestId, setSelectedTestId] = useState<string | null>(null);

  const statusCounts = useMemo(() => {
    return tests.reduce(
      (acc, test) => {
        acc[test.status] += 1;
        return acc;
      },
      { passed: 0, failed: 0, flaky: 0, skipped: 0 }
    );
  }, [tests]);

  const filteredGroups = useMemo<SpecGroup[]>(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const groups = new Map<string, SpecGroup>();

    specs.forEach((spec) => {
      const filteredTests = spec.tests.filter((test) => {
        if (statusFilter !== 'all' && test.status !== statusFilter) {
          return false;
        }

        if (!normalizedQuery) {
          return true;
        }

        const haystack = [test.title].filter(Boolean).join(' ').toLowerCase();

        return haystack.includes(normalizedQuery);
      });

      if (!filteredTests.length) {
        return;
      }

      const specWithTests: SpecWithFilteredTests = {
        ...spec,
        tests: filteredTests,
      };
      const groupKey =
        spec.file ?? (spec.path.length ? spec.path.join(' / ') : spec.id);
      const groupLabel = spec.file ?? spec.path.join(' / ') ?? 'Sem arquivo';

      if (!groups.has(groupKey)) {
        groups.set(groupKey, { id: groupKey, label: groupLabel, specs: [] });
      }

      groups.get(groupKey)!.specs.push(specWithTests);
    });

    return Array.from(groups.values());
  }, [specs, statusFilter, query]);

  const filteredTests = useMemo(
    () =>
      filteredGroups.flatMap((group) =>
        group.specs.flatMap((spec) => spec.tests)
      ),
    [filteredGroups]
  );

  useEffect(() => {
    if (!filteredTests.length) {
      setSelectedTestId(null);
      return;
    }

    if (
      !selectedTestId ||
      !filteredTests.find((test) => test.id === selectedTestId)
    ) {
      setSelectedTestId(filteredTests[0].id);
    }
  }, [filteredTests, selectedTestId]);

  const selectedTest = useMemo(
    () => tests.find((test) => test.id === selectedTestId) ?? null,
    [tests, selectedTestId]
  );
  const selectedTestPlaywrightUrl = useMemo(
    () => buildPlaywrightTestUrl(reportSrc, selectedTest?.id),
    [reportSrc, selectedTest]
  );

  if (!tests.length) {
    return (
      <Card>
        <CardContent>
          <Alert severity='info'>
            Nenhum cenário foi encontrado neste report.
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const statusOptions: Array<{
    value: TestStatusFilter;
    label: string;
    count: number;
  }> = [
    { value: 'all', label: 'Todos', count: tests.length },
    { value: 'passed', label: 'Sucesso', count: statusCounts.passed },
    { value: 'failed', label: 'Falha', count: statusCounts.failed },
    { value: 'flaky', label: 'Flaky', count: statusCounts.flaky },
    { value: 'skipped', label: 'Ignorados', count: statusCounts.skipped },
  ];

  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={3}
      alignItems='stretch'
      sx={{ width: '100%' }}
    >
      <Box sx={{ flexBasis: { md: '40%', lg: '32%' }, flexGrow: 1 }}>
        <Card sx={{ height: '100%' }}>
          <CardContent
            sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
          >
            <Stack spacing={2}>
              <TextField
                label='Buscar cenários'
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                size='small'
                fullWidth
              />
              <ToggleButtonGroup
                exclusive
                size='small'
                value={statusFilter}
                onChange={(_event, value: TestStatusFilter | null) => {
                  if (value) {
                    setStatusFilter(value);
                  }
                }}
                sx={{ flexWrap: 'wrap' }}
              >
                {statusOptions.map((option) => (
                  <ToggleButton
                    key={option.value}
                    value={option.value}
                    sx={{ textTransform: 'none' }}
                  >
                    {option.label} ({option.count})
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Stack>
            <Box sx={{ mt: 3, overflowY: 'auto', flex: 1 }}>
              {filteredGroups.length ? (
                filteredGroups.map((group) => (
                  <List
                    key={group.id}
                    dense
                    disablePadding
                    subheader={
                      <ListSubheader
                        disableSticky
                        sx={{ bgcolor: 'background.paper' }}
                      >
                        {group.label}
                      </ListSubheader>
                    }
                  >
                    {group.specs.flatMap((spec) =>
                      spec.tests.map((test) => {
                        const locationLabel = spec.file
                          ? spec.line
                            ? `${spec.file}:${spec.line}`
                            : spec.file
                          : spec.path.join(' / ');
                        const secondaryParts = [
                          locationLabel,
                          test.projectName,
                          formatDurationMs(test.durationMs),
                        ].filter(Boolean);

                        return (
                          <ListItemButton
                            key={test.id}
                            selected={test.id === selectedTestId}
                            onClick={() => setSelectedTestId(test.id)}
                            sx={{ borderRadius: 1, mb: 0.5 }}
                          >
                            <ListItemText
                              primary={test.title}
                              secondary={secondaryParts.join(' · ')}
                            />
                            <Chip
                              label={STATUS_META[test.status].label}
                              color={STATUS_META[test.status].color}
                              size='small'
                              variant='outlined'
                            />
                          </ListItemButton>
                        );
                      })
                    )}
                  </List>
                ))
              ) : (
                <Alert severity='info'>
                  Nenhum cenário corresponde aos filtros atuais.
                </Alert>
              )}
            </Box>
          </CardContent>
        </Card>
      </Box>
      <Box sx={{ flexBasis: { md: '60%', lg: '68%' }, flexGrow: 1 }}>
        <Card sx={{ height: '100%' }}>
          <CardContent
            sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
          >
            {selectedTest ? (
              <Stack spacing={3} sx={{ flex: 1 }}>
                <Stack spacing={0.5}>
                  <Typography variant='overline' color='text.secondary'>
                    Cenário selecionado
                  </Typography>
                  <Typography variant='h5'>{selectedTest.title}</Typography>
                  <Typography variant='body2' color='text.secondary'>
                    {selectedTest.fullTitle}
                  </Typography>
                </Stack>
                <Stack direction='row' spacing={1} flexWrap='wrap'>
                  <Chip
                    label={`Status: ${STATUS_META[selectedTest.status].label}`}
                    color={STATUS_META[selectedTest.status].color}
                    variant='outlined'
                  />
                  <Chip
                    label={`Duração: ${formatDurationMs(
                      selectedTest.durationMs
                    )}`}
                    variant='outlined'
                  />
                  <Chip
                    label={`Tentativas: ${selectedTest.attempts.length}`}
                    variant='outlined'
                  />
                  {selectedTest.projectName && (
                    <Chip
                      label={`Projeto: ${selectedTest.projectName}`}
                      variant='outlined'
                    />
                  )}
                  {selectedTest.specFile && (
                    <Chip
                      label={
                        selectedTest.specLine
                          ? `${selectedTest.specFile}:${selectedTest.specLine}`
                          : selectedTest.specFile
                      }
                      variant='outlined'
                    />
                  )}
                </Stack>
                <Button
                  component='a'
                  href={selectedTestPlaywrightUrl}
                  target='_blank'
                  rel='noreferrer'
                  variant='contained'
                  size='small'
                  sx={{ alignSelf: 'flex-start' }}
                >
                  Acessar Cenário no Playwright
                </Button>
                <Divider />
                <Stack spacing={2} sx={{ flex: 1, overflowY: 'auto' }}>
                  {selectedTest.attempts.map((attempt, index) => (
                    <Accordion
                      key={`${selectedTest.id}-${index}`}
                      defaultExpanded={
                        selectedTest.attempts.length === 1 ||
                        attempt.status !== 'passed'
                      }
                      disableGutters
                    >
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Stack
                          direction='row'
                          alignItems='center'
                          justifyContent='space-between'
                          sx={{ width: '100%' }}
                        >
                          <Typography fontWeight={600}>
                            Execução #{index + 1}
                          </Typography>
                          <Chip
                            label={ATTEMPT_META[attempt.status].label}
                            color={ATTEMPT_META[attempt.status].color}
                            size='small'
                          />
                        </Stack>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Stack spacing={2}>
                          <Stack direction='row' spacing={2} flexWrap='wrap'>
                            <Typography variant='body2' color='text.secondary'>
                              Duração: {formatDurationMs(attempt.durationMs)}
                            </Typography>
                            {attempt.startTime && (
                              <Typography
                                variant='body2'
                                color='text.secondary'
                              >
                                Iniciado em:{' '}
                                {new Date(attempt.startTime).toLocaleString()}
                              </Typography>
                            )}
                            {attempt.workerIndex !== undefined && (
                              <Typography
                                variant='body2'
                                color='text.secondary'
                              >
                                Worker #{attempt.workerIndex}
                              </Typography>
                            )}
                          </Stack>
                          <AttemptLogs
                            title='Saída padrão'
                            lines={attempt.stdout}
                            emptyLabel='Nenhum log capturado.'
                          />
                          <AttemptLogs
                            title='Erros'
                            lines={attempt.stderr}
                            emptyLabel='Sem erros no stderr.'
                          />
                          <AttemptErrors errors={attempt.errors} />
                          <AttemptAttachments
                            attachments={attempt.attachments}
                            attachmentsBasePath={attachmentsBasePath}
                            reportSrc={reportSrc}
                            testId={selectedTest.id}
                          />
                        </Stack>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Stack>
              </Stack>
            ) : (
              <Alert severity='info'>
                Selecione um cenário para visualizar os detalhes.
              </Alert>
            )}
          </CardContent>
        </Card>
      </Box>
    </Stack>
  );
}

function AttemptLogs({
  title,
  lines,
  emptyLabel,
}: {
  title: string;
  lines: string[];
  emptyLabel: string;
}) {
  return (
    <Box>
      <Typography variant='subtitle2' gutterBottom>
        {title}
      </Typography>
      {lines.length ? (
        <Box
          component='pre'
          sx={{
            bgcolor: (theme) => theme.palette.grey[900],
            color: (theme) => theme.palette.grey[100],
            fontSize: 13,
            fontFamily:
              'ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas',
            borderRadius: 1,
            p: 2,
            overflowX: 'auto',
            whiteSpace: 'pre-wrap',
          }}
        >
          {lines.map((line, index) => (
            <Box
              component='span'
              key={`${line}-${index}`}
              sx={{ display: 'block', my: 2 }}
            >
              {sanitizeLogLine(line)}
            </Box>
          ))}
        </Box>
      ) : (
        <Typography variant='body2' color='text.secondary'>
          {emptyLabel}
        </Typography>
      )}
    </Box>
  );
}

function AttemptErrors({
  errors,
}: {
  errors: PlaywrightReportTest['attempts'][number]['errors'];
}) {
  if (!errors.length) {
    return (
      <Box>
        <Typography variant='subtitle2' gutterBottom>
          Erros Playwright
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          Nenhum erro reportado.
        </Typography>
      </Box>
    );
  }

  return (
    <Stack spacing={1}>
      <Typography variant='subtitle2'>Erros Playwright</Typography>
      {errors.map((error, index) => (
        <Alert severity='error' key={`${error.message}-${index}`}>
          <Typography variant='body2'>{error.message}</Typography>
          {error.stack && (
            <Box
              component='pre'
              sx={{
                fontSize: 12,
                mt: 1,
                whiteSpace: 'pre-wrap',
                overflowX: 'auto',
              }}
            >
              {error.stack}
            </Box>
          )}
        </Alert>
      ))}
    </Stack>
  );
}

function AttemptAttachments({
  attachments,
  attachmentsBasePath,
  reportSrc,
  testId,
}: {
  attachments: PlaywrightReportTest['attempts'][number]['attachments'];
  attachmentsBasePath?: string;
  reportSrc: string;
  testId?: string;
}) {
  const buildAttachmentUrl = (rawPath?: string) => {
    if (!attachmentsBasePath || !rawPath) {
      return undefined;
    }

    const segments = rawPath.split('/').filter(Boolean);
    const fileName = segments[segments.length - 1];

    if (!fileName) {
      return undefined;
    }

    return `${attachmentsBasePath}/${fileName}`;
  };
  const playwrightTestUrl = buildPlaywrightTestUrl(reportSrc, testId);

  return (
    <Box>
      <Typography variant='subtitle2' gutterBottom>
        Anexos
      </Typography>
      {attachments.length ? (
        <Stack spacing={1}>
          {attachments.map((attachment, index) => {
            const label = attachment.name || `Anexo ${index + 1}`;
            const attachmentUrl = buildAttachmentUrl(attachment.path);

            const isVideo =
              attachment.contentType?.startsWith('video/') ||
              label.toLowerCase().includes('video');
            const buttonVariant = isVideo ? 'contained' : 'outlined';

            return (
              <Stack
                direction='row'
                spacing={1}
                alignItems='center'
                flexWrap='wrap'
                key={`${label}-${index}`}
              >
                {attachmentUrl ? (
                  <Button
                    component='a'
                    href={playwrightTestUrl}
                    target='_blank'
                    rel='noreferrer'
                    size='small'
                    variant={buttonVariant}
                  >
                    Acesse o Playwright para ter acesso ao vídeo
                  </Button>
                ) : null}
              </Stack>
            );
          })}
        </Stack>
      ) : (
        <Typography variant='body2' color='text.secondary'>
          Nenhum anexo foi registrado.
        </Typography>
      )}
    </Box>
  );
}

function sanitizeLogLine(line: string) {
  return line.replace(ANSI_REGEX, '');
}
