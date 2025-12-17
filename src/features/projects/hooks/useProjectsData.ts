import { useQuery } from '@tanstack/react-query';
import { fetchGitlabBranches, isGitlabConfigured } from '../api/gitlab.ts';
import {
  projects,
  type BranchInfo,
  type ProjectInfo,
} from '../data/projects.ts';
import {
  buildRunFromStats,
  deriveBranchStatusFromStats,
  fetchPlaywrightReport,
} from '../../reports/hooks/usePlaywrightReport.ts';

export interface ProjectsQueryData {
  items: ProjectInfo[];
  warnings: string[];
}

const FALLBACK_DATA: ProjectsQueryData = {
  items: projects,
  warnings: [],
};

const WEEK_MS = 1000 * 60 * 60 * 24 * 7;

async function hydrateBranchWithReport(
  project: ProjectInfo,
  branch: BranchInfo
): Promise<BranchInfo> {
  try {
    const summary = await fetchPlaywrightReport(project, branch.id);

    if (!summary?.stats) {
      return branch;
    }

    const stats = summary.stats;
    const durationMinutes = Math.max(1, Math.round(stats.duration / 60000));
    const latestRun = buildRunFromStats(stats, branch);

    return {
      ...branch,
      status: deriveBranchStatusFromStats(stats),
      totalScenarios: stats.total,
      passedScenarios: stats.passed,
      durationMinutes,
      runs: [latestRun],
    };
  } catch (error) {
    return branch;
  }
}

function applyProjectMetrics(
  project: ProjectInfo,
  branches: BranchInfo[]
): ProjectInfo {
  if (!branches.length) {
    return { ...project, branches };
  }

  let totalScenarios = 0;
  let passedScenarios = 0;
  let branchesWithStats = 0;
  let latestRunAt = project.lastRunAt;
  let latestRunTimestamp = project.lastRunAt
    ? new Date(project.lastRunAt).getTime()
    : 0;
  let runsThisWeek = 0;
  const now = Date.now();

  branches.forEach((branch) => {
    totalScenarios += branch.totalScenarios ?? 0;
    passedScenarios += branch.passedScenarios ?? 0;
    if (branch.totalScenarios > 0) {
      branchesWithStats += 1;
    }

    const branchUpdatedAt = new Date(branch.updatedAt).getTime();
    if (
      !Number.isNaN(branchUpdatedAt) &&
      branchUpdatedAt > latestRunTimestamp
    ) {
      latestRunTimestamp = branchUpdatedAt;
      latestRunAt = branch.updatedAt;
    }

    (branch.runs ?? []).forEach((run) => {
      const executedAt = new Date(run.executedAt).getTime();
      if (!Number.isNaN(executedAt) && now - executedAt <= WEEK_MS) {
        runsThisWeek += 1;
      }
    });
  });

  const computedPassRate = totalScenarios
    ? Math.round((passedScenarios / totalScenarios) * 100)
    : project.passRate;

  const computedCoverage = branches.length
    ? Math.round((branchesWithStats / branches.length) * 100)
    : project.coverage;

  return {
    ...project,
    branches,
    passRate: computedPassRate,
    coverage: computedCoverage,
    totalRunsThisWeek: runsThisWeek || project.totalRunsThisWeek,
    lastRunAt: latestRunAt ?? project.lastRunAt,
  };
}

async function hydrateProject(project: ProjectInfo): Promise<ProjectInfo> {
  const branches = await fetchGitlabBranches(project);
  const enrichedBranches = await Promise.all(
    branches.map((branch) => hydrateBranchWithReport(project, branch))
  );

  return applyProjectMetrics(project, enrichedBranches);
}

export function useProjectsData() {
  return useQuery<ProjectsQueryData>({
    queryKey: ['projects-with-gitlab'],
    initialData: FALLBACK_DATA,
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnReconnect: 'always',
    queryFn: async () => {
      if (!isGitlabConfigured) {
        return {
          items: projects,
          warnings: [
            'Defina VITE_GITLAB_TOKEN (e opcionalmente VITE_GITLAB_API_URL) para sincronizar com o GitLab.',
          ],
        } satisfies ProjectsQueryData;
      }

      const results = await Promise.allSettled(projects.map(hydrateProject));
      const warnings: string[] = [];

      const items = results.map((result, index) => {
        if (result.status === 'fulfilled') {
          return result.value;
        }

        warnings.push(
          `${projects[index].name}: ${
            result.reason instanceof Error
              ? result.reason.message
              : 'Falha desconhecida ao sincronizar com o GitLab.'
          }`
        );

        return projects[index];
      });

      return { items, warnings } satisfies ProjectsQueryData;
    },
  });
}
