import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import { useNavigate, useParams } from 'react-router-dom';
import { PageHeader } from '../../../components/PageHeader.tsx';
import {
  buildBranchReportPath,
  getBranch,
  getProjectById,
  projects,
} from '../../projects/data/projects.ts';
import { ReportViewer } from '../components/ReportViewer.tsx';
import { RunHistory } from '../components/RunHistory.tsx';
import { EmptyState } from '../../../components/EmptyState.tsx';
import { useProjectsData } from '../../projects/hooks/useProjectsData.ts';

export function BranchReportPage() {
  const navigate = useNavigate();
  const { projectId, branchId } = useParams<{
    projectId: string;
    branchId: string;
  }>();

  if (!projectId || !branchId) {
    return (
      <EmptyState
        title='Link incompleto'
        description='Não foi possível identificar o projeto ou a branch selecionada.'
        actionLabel='Voltar'
        onAction={() => navigate(-1)}
      />
    );
  }

  const { data, isFetching } = useProjectsData();
  const syncedProjects = data?.items ?? projects;
  const project = getProjectById(projectId, syncedProjects);
  const branch = project
    ? getBranch(projectId, branchId, syncedProjects)
    : undefined;
  const warnings = data?.warnings ?? [];
  const warningText =
    warnings.length > 0
      ? warnings.length === 1
        ? warnings[0]
        : `Ocorreram falhas ao sincronizar algumas branches. ${warnings.join(
            ' '
          )}`
      : '';

  if (!project || !branch) {
    return (
      <EmptyState
        title='Report não disponível'
        description='Confirme se o projeto e a branch ainda estão ativos.'
        actionLabel='Voltar'
        onAction={() => navigate(-1)}
      />
    );
  }

  const computedReportPath = buildBranchReportPath(project.id, branch.id);
  const reportSrc =
    branch.reportPath && !branch.reportPath.startsWith('/reports/')
      ? branch.reportPath
      : computedReportPath;
  console.log({ reportSrc });

  return (
    <Stack spacing={4}>
      <PageHeader
        title={`${project.name} · ${branch.name}`}
        subtitle={branch.lastCommit}
        breadcrumbs={[
          { label: 'Projetos', href: '/' },
          { label: project.name, href: `/projects/${project.id}` },
          { label: branch.name },
        ]}
        actions={
          <Button
            startIcon={<ArrowBackRoundedIcon />}
            onClick={() => navigate(-1)}
          >
            Voltar
          </Button>
        }
      />

      <ReportViewer src={reportSrc} />

      {isFetching && <LinearProgress sx={{ width: '100%' }} />}

      {warningText && <Alert severity='warning'>{warningText}</Alert>}

      {branch.runs.length > 0 && <RunHistory runs={branch.runs} />}
    </Stack>
  );
}
