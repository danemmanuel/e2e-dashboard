import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import { useNavigate, useParams } from 'react-router-dom';
import { PageHeader } from '../../../components/PageHeader.tsx';
import { getBranch, getProjectById } from '../../projects/data/projects.ts';
import { ReportViewer } from '../components/ReportViewer.tsx';
import { RunHistory } from '../components/RunHistory.tsx';
import { EmptyState } from '../../../components/EmptyState.tsx';

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

  const project = getProjectById(projectId);
  const branch = project ? getBranch(projectId, branchId) : undefined;

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

      <ReportViewer src={branch.reportPath} />

      {branch.runs.length > 0 && <RunHistory runs={branch.runs} />}
    </Stack>
  );
}
