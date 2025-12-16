import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import ChecklistRtlOutlinedIcon from '@mui/icons-material/ChecklistRtlOutlined';
import { PageHeader } from '../../../components/PageHeader.tsx';
import { MetricCard } from '../../../components/MetricCard.tsx';
import { projects } from '../data/projects.ts';
import { ProjectCard } from '../components/ProjectCard.tsx';
import { formatPercent } from '../../../utils/format.ts';
import { useDashboardFilters } from '../../../providers/DashboardFilters.tsx';
import { useProjectsData } from '../hooks/useProjectsData.ts';

const RANGE_LABEL: Record<string, string> = {
  '7d': 'últimos 7 dias',
  '14d': 'últimos 14 dias',
  '30d': 'últimos 30 dias',
};

export function ProjectsPage() {
  const { timeRange } = useDashboardFilters();
  const { data, isFetching, refetch } = useProjectsData();
  const syncedProjects = data?.items ?? projects;
  const warnings = data?.warnings ?? [];
  const hasWarnings = warnings.length > 0;
  const warningMessage = hasWarnings
    ? warnings.length === 1
      ? warnings[0]
      : `Ocorreram falhas ao sincronizar algumas branches. ${warnings.join(
          ' '
        )}`
    : '';

  const totalProjects = syncedProjects.length;
  const avgPassRate =
    syncedProjects.reduce((acc, project) => acc + project.passRate, 0) /
    totalProjects;
  const unstableBranches = syncedProjects
    .map(
      (project) =>
        project.branches.filter((branch) => branch.status !== 'passing').length
    )
    .reduce((acc, count) => acc + count, 0);

  return (
    <Stack spacing={4}>
      <PageHeader
        title='Projetos monitorados'
        subtitle={`Panorama consolidado dos ${RANGE_LABEL[timeRange]}.`}
      />

      {isFetching && <LinearProgress sx={{ width: '100%' }} />}

      {hasWarnings && (
        <Alert
          severity='warning'
          action={
            <Button color='inherit' size='small' onClick={() => refetch()}>
              Tentar novamente
            </Button>
          }
        >
          {warningMessage}
        </Alert>
      )}

      <Box
        sx={{
          display: 'grid',
          gap: 3,
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' },
        }}
      >
        <MetricCard
          label='Projetos ativos'
          value={`${totalProjects}`}
          helperText='Cobertos por pipelines de E2E'
          icon={<ChecklistRtlOutlinedIcon color='primary' fontSize='large' />}
        />
        <MetricCard
          label='Pass rate médio'
          value={formatPercent(avgPassRate)}
          helperText={RANGE_LABEL[timeRange]}
          icon={<TrendingUpOutlinedIcon color='success' fontSize='large' />}
        />
        <MetricCard
          label='Branches com atenção'
          value={`${unstableBranches}`}
          helperText='Status unstable ou failing'
          icon={<WarningAmberOutlinedIcon color='warning' fontSize='large' />}
        />
      </Box>

      <Box
        sx={{
          display: 'grid',
          gap: 3,
          gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, minmax(0, 1fr))' },
        }}
      >
        {syncedProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </Box>
    </Stack>
  );
}
