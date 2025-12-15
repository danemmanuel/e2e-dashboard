import Box from '@mui/material/Box';
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

const RANGE_LABEL: Record<string, string> = {
  '7d': 'últimos 7 dias',
  '14d': 'últimos 14 dias',
  '30d': 'últimos 30 dias',
};

export function ProjectsPage() {
  const { timeRange } = useDashboardFilters();
  const totalProjects = projects.length;
  const avgPassRate =
    projects.reduce((acc, project) => acc + project.passRate, 0) /
    totalProjects;
  const unstableBranches = projects
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
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </Box>
    </Stack>
  );
}
