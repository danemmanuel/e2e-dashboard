import { useQuery } from '@tanstack/react-query';
import { fetchGitlabBranches, isGitlabConfigured } from '../api/gitlab.ts';
import { projects, type ProjectInfo } from '../data/projects.ts';

export interface ProjectsQueryData {
  items: ProjectInfo[];
  warnings: string[];
}

const FALLBACK_DATA: ProjectsQueryData = {
  items: projects,
  warnings: [],
};

async function hydrateProject(project: ProjectInfo): Promise<ProjectInfo> {
  const branches = await fetchGitlabBranches(project);
  return { ...project, branches };
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
