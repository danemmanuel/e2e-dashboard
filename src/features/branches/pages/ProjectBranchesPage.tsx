import { useMemo, useState } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import { useParams } from 'react-router-dom';
import { PageHeader } from '../../../components/PageHeader.tsx';
import { getProjectById, projects } from '../../projects/data/projects.ts';
import { EmptyState } from '../../../components/EmptyState.tsx';
import { BranchCard } from '../components/BranchCard.tsx';
import { useProjectsData } from '../../projects/hooks/useProjectsData.ts';
import { TextField, Typography } from '@mui/material';

export function ProjectBranchesPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const { data, isFetching, refetch } = useProjectsData();
  const [branchQuery, setBranchQuery] = useState('');
  const syncedProjects = data?.items ?? projects;
  const warnings = data?.warnings ?? [];
  const project = projectId
    ? getProjectById(projectId, syncedProjects)
    : undefined;
  const hasWarnings = warnings.length > 0;
  const warningText = hasWarnings
    ? warnings.length === 1
      ? warnings[0]
      : `Ocorreram falhas ao sincronizar algumas branches. ${warnings.join(
          ' '
        )}`
    : '';

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

  const filteredBranches = useMemo(() => {
    const normalizedQuery = branchQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return project.branches;
    }

    return project.branches.filter((branch) =>
      branch.name.toLowerCase().includes(normalizedQuery)
    );
  }, [project.branches, branchQuery]);

  return (
    <Stack spacing={4}>
      <PageHeader
        title={project.name}
        subtitle={`
            Branches: ${project.branches.length}
          `}
        breadcrumbs={[
          { label: 'Projetos', href: '/' },
          { label: project.name },
        ]}
        actions={
          <Button
            variant='outlined'
            startIcon={<RefreshRoundedIcon />}
            size='small'
            onClick={() => refetch()}
            disabled={isFetching}
          >
            Sincronizar com GitLab
          </Button>
        }
      />

      {isFetching && <LinearProgress sx={{ width: '100%' }} />}

      {hasWarnings && <Alert severity='warning'>{warningText}</Alert>}

      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={2}
        alignItems={{ xs: 'flex-start', md: 'center' }}
        justifyContent='space-between'
      >
        <TextField
          size='small'
          label='Filtrar por nome da branch'
          value={branchQuery}
          onChange={(event) => setBranchQuery(event.target.value)}
          sx={{ width: { xs: '100%', md: 320 } }}
        />
      </Stack>
      <Box
        sx={{
          display: 'grid',
          gap: 3,
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' },
        }}
      >
        {filteredBranches.length ? (
          filteredBranches.map((branch) => (
            <BranchCard key={branch.id} branch={branch} project={project} />
          ))
        ) : (
          <Alert severity='info'>Nenhuma branch corresponde ao filtro.</Alert>
        )}
      </Box>
    </Stack>
  );
}
