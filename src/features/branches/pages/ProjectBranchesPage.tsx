import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import { useParams } from 'react-router-dom';
import { PageHeader } from '../../../components/PageHeader.tsx';
import { getProjectById } from '../../projects/data/projects.ts';
import { EmptyState } from '../../../components/EmptyState.tsx';
import { BranchCard } from '../components/BranchCard.tsx';

export function ProjectBranchesPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const project = projectId ? getProjectById(projectId) : undefined;

  if (!project) {
    return (
      <EmptyState
        title='Projeto não encontrado'
        description='Não identificamos o projeto solicitado. Se o link veio de um report antigo, confirme se ele ainda está ativo.'
        actionLabel='Voltar aos projetos'
        onAction={() => history.back()}
      />
    );
  }

  return (
    <Stack spacing={4}>
      <PageHeader
        title={project.name}
        subtitle={project.description}
        breadcrumbs={[
          { label: 'Projetos', href: '/' },
          { label: project.name },
        ]}
        actions={
          <Button
            variant='outlined'
            startIcon={<RefreshRoundedIcon />}
            size='small'
          >
            Reprocessar E2E
          </Button>
        }
      />

      <Box
        sx={{
          display: 'grid',
          gap: 3,
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
        }}
      >
        {project.branches.map((branch) => (
          <BranchCard key={branch.id} branch={branch} projectId={project.id} />
        ))}
      </Box>
    </Stack>
  );
}
