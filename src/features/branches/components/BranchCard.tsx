import {
  Card,
  CardActions,
  CardContent,
  Chip,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material';
import CommitRoundedIcon from '@mui/icons-material/CommitRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import type { KeyboardEvent } from 'react';
import type { BranchInfo, ProjectInfo } from '../../projects/data/projects.ts';
import { StatusChip } from '../../../components/StatusChip.tsx';
import {
  formatRelativeTime,
  formatCoverage,
  formatDuration,
  formatDurationMs,
} from '../../../utils/format.ts';
import { useNavigate } from 'react-router-dom';
import {
  usePlaywrightReport,
  deriveBranchStatusFromStats,
} from '../../reports/hooks/usePlaywrightReport.ts';

interface BranchCardProps {
  project: ProjectInfo;
  branch: BranchInfo;
}

export function BranchCard({ branch, project }: BranchCardProps) {
  const navigate = useNavigate();
  const { data: reportData, isFetching: isReportFetching } =
    usePlaywrightReport(project, branch.id);
  const stats = reportData?.stats;
  const totalScenarios = stats?.total ?? branch.totalScenarios;
  const passedScenarios = stats?.passed ?? branch.passedScenarios;
  const failedScenarios =
    stats?.failed ?? Math.max(0, totalScenarios - passedScenarios);
  const coverage = formatCoverage(passedScenarios, totalScenarios);
  const progress = totalScenarios
    ? (passedScenarios / totalScenarios) * 100
    : 0;
  const progressColor =
    progress >= 90
      ? 'success.main'
      : progress >= 40
      ? 'warning.dark'
      : 'error.main';
  const branchRoute = `/projects/${project.id}/${branch.id}`;
  const status = stats ? deriveBranchStatusFromStats(stats) : branch.status;
  const durationLabel = stats
    ? formatDurationMs(stats.duration)
    : formatDuration(branch.durationMinutes);

  const handleNavigate = () => navigate(branchRoute);
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleNavigate();
    }
  };

  return (
    <Card
      sx={{
        height: '100%',
        border: '1px solid',
        borderColor: 'divider',
        transition: 'all 0.2s ease-in-out',
        cursor: 'pointer',
        '&:hover': {
          boxShadow: '0px 12px 30px rgba(15, 23, 42, 0.12)',
          transform: 'translateY(-2px)',
        },
      }}
      onClick={handleNavigate}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role='button'
      aria-label={`Abrir report da branch ${branch.name}`}
    >
      <CardContent>
        <Stack spacing={2}>
          <Stack
            direction='row'
            justifyContent='space-between'
            alignItems='center'
          >
            <Typography variant='h6'>{branch.name}</Typography>
            {reportData ? (
              <Chip
                label='Playwright'
                size='small'
                color='success'
                variant='outlined'
              />
            ) : isReportFetching ? (
              <Chip
                label='Sincronizando...'
                size='small'
                color='info'
                variant='outlined'
              />
            ) : null}
          </Stack>
          <Stack
            direction='row'
            justifyContent='space-between'
            alignItems='center'
          >
            <StatusChip status={status} />
          </Stack>
          <Stack spacing={1}>
            <Typography variant='body2' color='text.secondary'>
              {branch.lastCommit}
            </Typography>
            <Stack direction='row' spacing={2} alignItems='center'>
              <Stack direction='row' spacing={1} alignItems='center'>
                <CommitRoundedIcon fontSize='small' color='action' />
                <Typography variant='caption' color='text.secondary'>
                  {totalScenarios} cenários
                </Typography>
              </Stack>
              <Stack direction='row' spacing={1} alignItems='center'>
                <AccessTimeRoundedIcon fontSize='small' color='action' />
                <Typography variant='caption' color='text.secondary'>
                  {durationLabel}
                </Typography>
              </Stack>
            </Stack>
            <Stack spacing={1}>
              <Typography variant='caption' color='text.secondary'>
                Taxa de aprovação {coverage}
              </Typography>
              <LinearProgress
                variant='determinate'
                value={progress}
                sx={{
                  borderRadius: 4,
                  height: 6,
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: progressColor,
                  },
                  backgroundColor: 'action.hover',
                }}
              />
            </Stack>
          </Stack>
          <Typography variant='caption' color='text.secondary'>
            Atualizado {formatRelativeTime(branch.updatedAt)}
          </Typography>
        </Stack>
      </CardContent>
      <CardActions sx={{ justifyContent: 'space-between', px: 3, pb: 3 }}>
        <Typography variant='body2' color='text.secondary'>
          {passedScenarios}/{totalScenarios} cenários aprovados ·{' '}
          {failedScenarios} falharam
        </Typography>
      </CardActions>
    </Card>
  );
}
