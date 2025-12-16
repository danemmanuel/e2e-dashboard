import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import LaunchRoundedIcon from '@mui/icons-material/LaunchRounded';
import { useNavigate, useParams } from 'react-router-dom';
import { PageHeader } from '../../../components/PageHeader.tsx';
import {
  buildBranchReportPath,
  buildBranchReportDataPath,
  getBranch,
  getProjectById,
  projects,
} from '../../projects/data/projects.ts';
import { EmptyState } from '../../../components/EmptyState.tsx';
import { useProjectsData } from '../../projects/hooks/useProjectsData.ts';
import { ReportStats } from '../components/ReportStats.tsx';
import { ReportDetails } from '../components/ReportDetails.tsx';
import {
  usePlaywrightReport,
  deriveBranchStatusFromStats,
} from '../hooks/usePlaywrightReport.ts';

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

  const { data, isFetching: isProjectsFetching } = useProjectsData();
  const syncedProjects = data?.items ?? projects;
  const project = getProjectById(projectId, syncedProjects);
  const branch = project
    ? getBranch(projectId, branchId, syncedProjects)
    : undefined;
  const {
    data: playwrightReport,
    isFetching: isReportFetching,
    error: reportError,
  } = usePlaywrightReport(project, branch?.id);
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

  const computedReportPath = buildBranchReportPath(project, branch.id);
  const reportDataBasePath = buildBranchReportDataPath(project, branch.id);
  const reportSrc =
    branch.reportPath && !branch.reportPath.startsWith('/reports/')
      ? branch.reportPath
      : computedReportPath;
  const derivedStatus = playwrightReport?.stats
    ? deriveBranchStatusFromStats(playwrightReport.stats)
    : branch.status;
  const jiraMatch = branch.name.match(/TELERISCO-\d+/i);
  const jiraKey = jiraMatch ? jiraMatch[0].toUpperCase() : null;
  const jiraUrl = jiraKey
    ? `https://telerisco.atlassian.net/browse/${jiraKey}`
    : null;

  const shouldShowMissingReportInfo =
    !reportError && !isReportFetching && playwrightReport === null;

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
          <Stack direction='row' spacing={1}>
            <Button
              startIcon={<ArrowBackRoundedIcon />}
              onClick={() => navigate(-1)}
            >
              Voltar
            </Button>
            {jiraUrl ? (
              <Button
                variant='outlined'
                component='a'
                href={jiraUrl}
                target='_blank'
                rel='noreferrer'
                endIcon={<LaunchRoundedIcon fontSize='small' />}
              >
                Abrir Jira
              </Button>
            ) : null}
            <Button
              variant='outlined'
              component='a'
              href={reportSrc}
              target='_blank'
              rel='noreferrer'
            >
              Abrir HTML do Playwright
            </Button>
          </Stack>
        }
      />

      {isProjectsFetching && <LinearProgress sx={{ width: '100%' }} />}
      {isReportFetching && <LinearProgress sx={{ width: '100%' }} />}

      {warningText && <Alert severity='warning'>{warningText}</Alert>}
      {reportError instanceof Error && (
        <Alert severity='error'>
          Falha ao carregar dados do Playwright: {reportError.message}
        </Alert>
      )}
      {shouldShowMissingReportInfo && (
        <Alert severity='info'>
          Nenhum report.json foi encontrado para esta branch.
        </Alert>
      )}

      {playwrightReport?.stats && (
        <ReportStats
          stats={playwrightReport.stats}
          passRate={playwrightReport.passRate}
          status={derivedStatus}
        />
      )}

      {playwrightReport?.specs?.length ? (
        <ReportDetails
          reportSrc={reportSrc}
          specs={playwrightReport.specs}
          tests={playwrightReport.tests}
          attachmentsBasePath={reportDataBasePath}
        />
      ) : null}

      {/* {runHistoryData.length > 0 && <RunHistory runs={runHistoryData} />} */}
    </Stack>
  );
}
