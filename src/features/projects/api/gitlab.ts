import { buildBranchReportPath } from '../data/projects.ts';
import type { BranchInfo, ProjectInfo } from '../data/projects.ts';

interface GitlabBranchCommit {
  id: string;
  message: string;
  title?: string;
  committed_date: string;
}

interface GitlabBranchResponse {
  name: string;
  web_url: string;
  commit?: GitlabBranchCommit;
}

const DEFAULT_API_URL = 'https://git.datasystec.com.br/api/v4';
const rawApiUrl =
  (import.meta.env.VITE_GITLAB_API_URL as string | undefined) ??
  DEFAULT_API_URL;
const apiBaseUrl = rawApiUrl.replace(/\/$/, '');
const gitlabToken = import.meta.env.VITE_GITLAB_TOKEN as string | undefined;
export const isGitlabConfigured = Boolean(gitlabToken);

function extractProjectPath(urlGit: string) {
  try {
    const parsed = new URL(urlGit);
    return parsed.pathname.replace(/^\/+/, '').replace(/\.git$/, '');
  } catch (error) {
    throw new Error('URL do GitLab invalida para o projeto.');
  }
}

function fallbackBranchMap(branches: BranchInfo[]) {
  return branches.reduce<Record<string, BranchInfo>>((acc, branch) => {
    acc[branch.id.toLowerCase()] = branch;
    acc[branch.name.toLowerCase()] = branch;
    acc[branch.id.replace(/\//g, '-').toLowerCase()] = branch;
    acc[branch.name.replace(/\//g, '-').toLowerCase()] = branch;
    return acc;
  }, {});
}

function normalizeBranch(
  gitlabBranch: GitlabBranchResponse,
  project: ProjectInfo,
  fallback?: BranchInfo
): BranchInfo {
  const committedAt =
    gitlabBranch.commit?.committed_date ??
    fallback?.updatedAt ??
    new Date().toISOString();
  const commitMessage =
    gitlabBranch.commit?.title ??
    gitlabBranch.commit?.message?.split('\n')[0] ??
    fallback?.lastCommit ??
    'Ultimo commit nao disponivel';

  const base: BranchInfo = fallback ?? {
    id: gitlabBranch.name,
    name: gitlabBranch.name,
    owner: project.owner,
    status: 'passing',
    updatedAt: committedAt,
    lastCommit: commitMessage,
    totalScenarios: 0,
    passedScenarios: 0,
    durationMinutes: 0,
    reportPath: buildBranchReportPath(project.id, gitlabBranch.name),
    runs: [],
  };

  return {
    ...base,
    id: gitlabBranch.name,
    name: gitlabBranch.name,
    updatedAt: committedAt,
    lastCommit: commitMessage,
    reportPath: buildBranchReportPath(project.id, gitlabBranch.name),
  };
}

export async function fetchGitlabBranches(
  project: ProjectInfo
): Promise<BranchInfo[]> {
  if (!project.urlGit || !gitlabToken) {
    return project.branches;
  }

  const projectPath = encodeURIComponent(extractProjectPath(project.urlGit));
  const response = await fetch(
    `${apiBaseUrl}/projects/${projectPath}/repository/branches?per_page=100`,
    {
      headers: {
        'Content-Type': 'application/json',
        'PRIVATE-TOKEN': gitlabToken,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`GitLab respondeu com status ${response.status}`);
  }

  const gitlabBranches = (await response.json()) as GitlabBranchResponse[];

  if (!Array.isArray(gitlabBranches) || gitlabBranches.length === 0) {
    return project.branches;
  }

  const fallbackMap = fallbackBranchMap(project.branches);
  const normalizedBranches = gitlabBranches.map((branch) => {
    const loweredName = branch.name.toLowerCase();
    const normalizedFallbackKey = branch.name.replace(/\//g, '-').toLowerCase();
    const fallback =
      fallbackMap[loweredName] ?? fallbackMap[normalizedFallbackKey];
    return normalizeBranch(branch, project, fallback);
  });

  const fallbackOnly = project.branches.filter(
    (branch) => !normalizedBranches.some((item) => item.id === branch.id)
  );

  return [...normalizedBranches, ...fallbackOnly];
}
