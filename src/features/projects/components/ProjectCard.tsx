import {
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Stack,
  Typography,
} from '@mui/material';
import ShowChartOutlinedIcon from '@mui/icons-material/ShowChartOutlined';
import TimelineOutlinedIcon from '@mui/icons-material/TimelineOutlined';
import Groups2OutlinedIcon from '@mui/icons-material/Groups2Outlined';
import { Link as RouterLink } from 'react-router-dom';
import { formatRelativeTime, formatPercent } from '../../../utils/format.ts';
import type { ProjectInfo } from '../data/projects.ts';
import type { ReactNode } from 'react';

interface ProjectCardProps {
  project: ProjectInfo;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardActionArea
        component={RouterLink}
        to={`/projects/${project.id}`}
        sx={{ height: '100%' }}
      >
        <CardContent>
          <Stack spacing={2}>
            <Stack
              direction='row'
              justifyContent='space-between'
              alignItems='center'
            >
              <Stack spacing={0.5}>
                <Typography variant='overline' color='text.secondary'>
                  {project.owner}
                </Typography>
                <Typography variant='h5'>{project.name}</Typography>
              </Stack>
              <Chip
                label={`${project.branches.length} branches`}
                size='small'
              />
            </Stack>
            <Typography variant='body2' color='text.secondary'>
              {project.description}
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <StatBlock
                icon={<ShowChartOutlinedIcon color='primary' />}
                label='Pass rate'
                value={formatPercent(project.passRate)}
              />
              <StatBlock
                icon={<TimelineOutlinedIcon color='secondary' />}
                label='Coverage'
                value={formatPercent(project.coverage)}
              />
              <StatBlock
                icon={<Groups2OutlinedIcon color='action' />}
                label='Runs na semana'
                value={String(project.totalRunsThisWeek)}
              />
            </Stack>
            <Typography variant='caption' color='text.secondary'>
              Última execução {formatRelativeTime(project.lastRunAt)}
            </Typography>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

interface StatBlockProps {
  icon: ReactNode;
  label: string;
  value: string;
}

function StatBlock({ icon, label, value }: StatBlockProps) {
  return (
    <Stack direction='row' spacing={1.5} alignItems='center' flex={1}>
      {icon}
      <div>
        <Typography variant='body2' color='text.secondary'>
          {label}
        </Typography>
        <Typography variant='h6'>{value}</Typography>
      </div>
    </Stack>
  );
}
