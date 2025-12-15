import {
  Card,
  CardActions,
  CardContent,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material';
import CommitRoundedIcon from '@mui/icons-material/CommitRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import type { KeyboardEvent } from 'react';
import type { BranchInfo } from '../../projects/data/projects.ts';
import { StatusChip } from '../../../components/StatusChip.tsx';
import {
  formatRelativeTime,
  formatCoverage,
  formatDuration,
} from '../../../utils/format.ts';
import { useNavigate } from 'react-router-dom';

interface BranchCardProps {
  projectId: string;
  branch: BranchInfo;
}

export function BranchCard({ branch, projectId }: BranchCardProps) {
  const navigate = useNavigate();
  const coverage = formatCoverage(
    branch.passedScenarios,
    branch.totalScenarios
  );
  const progress = branch.totalScenarios
    ? (branch.passedScenarios / branch.totalScenarios) * 100
    : 0;
  const progressColor =
    progress >= 90
      ? 'success.main'
      : progress >= 40
      ? 'warning.dark'
      : 'error.main';
  const branchRoute = `/projects/${projectId}/${branch.id}`;

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
          </Stack>
          <Stack
            direction='row'
            justifyContent='space-between'
            alignItems='center'
          >
            <StatusChip status={branch.status} />
          </Stack>
          <Stack spacing={1}>
            <Typography variant='body2' color='text.secondary'>
              {branch.lastCommit}
            </Typography>
            <Stack direction='row' spacing={2} alignItems='center'>
              <Stack direction='row' spacing={1} alignItems='center'>
                <CommitRoundedIcon fontSize='small' color='action' />
                <Typography variant='caption' color='text.secondary'>
                  {branch.totalScenarios} cenários
                </Typography>
              </Stack>
              <Stack direction='row' spacing={1} alignItems='center'>
                <AccessTimeRoundedIcon fontSize='small' color='action' />
                <Typography variant='caption' color='text.secondary'>
                  {formatDuration(branch.durationMinutes)}
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
          {branch.passedScenarios}/{branch.totalScenarios} cenários aprovados
        </Typography>
      </CardActions>
    </Card>
  );
}
