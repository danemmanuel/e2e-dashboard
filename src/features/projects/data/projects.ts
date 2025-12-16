export type BranchStatus = 'passing' | 'unstable' | 'failing';

export interface BranchRun {
  id: string;
  executedAt: string;
  passRate: number;
  durationMinutes: number;
  totalScenarios: number;
  failedScenarios: number;
  status: BranchStatus;
}

export interface BranchInfo {
  id: string;
  name: string;
  owner: string;
  status: BranchStatus;
  updatedAt: string;
  lastCommit: string;
  totalScenarios: number;
  passedScenarios: number;
  durationMinutes: number;
  reportPath: string;
  runs: BranchRun[];
}

export interface ProjectInfo {
  id: string;
  name: string;
  description: string;
  owner: string;
  urlGit: string;
  reportSlug?: string;
  passRate: number;
  coverage: number;
  lastRunAt: string;
  totalRunsThisWeek: number;
  branches: BranchInfo[];
}

const whitespaceRegex = /\s+/g;

function normalizeReportSegment(value: string) {
  return value.trim().replace(whitespaceRegex, '-');
}

function buildBranchReportBase(
  project: Pick<ProjectInfo, 'id' | 'reportSlug'>,
  branchId: string
) {
  const projectSegment = normalizeReportSegment(
    project.reportSlug ?? project.id
  );
  return `/reports/${projectSegment}/${normalizeReportSegment(branchId)}`;
}

export function buildBranchReportPath(
  project: Pick<ProjectInfo, 'id' | 'reportSlug'>,
  branchId: string
) {
  return `${buildBranchReportBase(project, branchId)}/index.html`;
}

export function buildBranchReportJsonPath(
  project: Pick<ProjectInfo, 'id' | 'reportSlug'>,
  branchId: string
) {
  return `${buildBranchReportBase(project, branchId)}/report.json`;
}

export function buildBranchReportDataPath(
  project: Pick<ProjectInfo, 'id' | 'reportSlug'>,
  branchId: string
) {
  return `${buildBranchReportBase(project, branchId)}/data`;
}

export const projects: ProjectInfo[] = [
  {
    id: 'telerisco-front',
    name: 'Telerisco',
    description: 'Operacional, Atendimento, Consulta, Pesquisa e Auditoria',
    owner: 'Telerisco',
    urlGit: 'https://git.datasystec.com.br/telerisco/telerisco-front',
    reportSlug: 'telerisco-front',
    passRate: 96,
    coverage: 82,
    lastRunAt: '2025-12-14T02:15:00Z',
    totalRunsThisWeek: 18,
    branches: [],
  },
  {
    id: 'pesquisa-chatbot-react',
    name: 'Chatbot',
    description: 'Chatbot desc',
    owner: 'Sompo',
    urlGit:
      'https://git.datasystec.com.br/telerisco/pesquisa-digital/pesquisa-chatbot-react',
    reportSlug: 'pesquisa-chatbot-react',
    passRate: 94,
    coverage: 80,
    lastRunAt: '2025-12-14T09:05:00Z',
    totalRunsThisWeek: 14,
    branches: [],
  },
  // {
  //   id: 'operacional',
  //   name: 'Operacional',
  //   description: 'Ferramentas internas para monitoramento e suporte 24/7.',
  //   owner: 'Telerisco',
  //   urlGit: 'https://git.datasystec.com.br/telerisco/operacional-e2e',
  //   passRate: 87,
  //   coverage: 71,
  //   lastRunAt: '2025-12-14T04:30:00Z',
  //   totalRunsThisWeek: 10,
  //   branches: [
  //     {
  //       id: 'develop',
  //       name: 'develop',
  //       owner: 'Ops Squad',
  //       status: 'unstable',
  //       updatedAt: '2025-12-14T04:30:00Z',
  //       lastCommit: 'fix: corrige alerta duplicado',
  //       totalScenarios: 118,
  //       passedScenarios: 102,
  //       durationMinutes: 31,
  //       reportPath: '/reports/atendimento/index.html',
  //       runs: [
  //         {
  //           id: 'operacional-develop-20251214-1',
  //           executedAt: '2025-12-14T04:30:00Z',
  //           passRate: 86,
  //           durationMinutes: 31,
  //           totalScenarios: 118,
  //           failedScenarios: 16,
  //           status: 'unstable',
  //         },
  //         {
  //           id: 'operacional-develop-20251213-1',
  //           executedAt: '2025-12-13T05:05:00Z',
  //           passRate: 82,
  //           durationMinutes: 32,
  //           totalScenarios: 118,
  //           failedScenarios: 21,
  //           status: 'unstable',
  //         },
  //         {
  //           id: 'operacional-develop-20251212-1',
  //           executedAt: '2025-12-12T05:20:00Z',
  //           passRate: 77,
  //           durationMinutes: 34,
  //           totalScenarios: 116,
  //           failedScenarios: 27,
  //           status: 'failing',
  //         },
  //       ],
  //     },
  //     {
  //       id: 'master',
  //       name: 'master',
  //       owner: 'Ops Squad',
  //       status: 'passing',
  //       updatedAt: '2025-12-13T19:20:00Z',
  //       lastCommit: 'feat: dashboards de SLA',
  //       totalScenarios: 118,
  //       passedScenarios: 110,
  //       durationMinutes: 30,
  //       reportPath: '/reports/atendimento/index.html',
  //       runs: [
  //         {
  //           id: 'operacional-master-20251213-1',
  //           executedAt: '2025-12-13T19:20:00Z',
  //           passRate: 93,
  //           durationMinutes: 30,
  //           totalScenarios: 118,
  //           failedScenarios: 8,
  //           status: 'passing',
  //         },
  //         {
  //           id: 'operacional-master-20251212-1',
  //           executedAt: '2025-12-12T18:55:00Z',
  //           passRate: 89,
  //           durationMinutes: 31,
  //           totalScenarios: 118,
  //           failedScenarios: 13,
  //           status: 'passing',
  //         },
  //         {
  //           id: 'operacional-master-20251211-1',
  //           executedAt: '2025-12-11T18:10:00Z',
  //           passRate: 84,
  //           durationMinutes: 32,
  //           totalScenarios: 116,
  //           failedScenarios: 19,
  //           status: 'unstable',
  //         },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   id: 'auditoria',
  //   name: 'Auditoria',
  //   description: 'Motor de conformidade e trilhas de auditoria de contratos.',
  //   owner: 'Telerisco',
  //   urlGit: 'https://git.datasystec.com.br/telerisco/auditoria-e2e',
  //   passRate: 90,
  //   coverage: 76,
  //   lastRunAt: '2025-12-13T23:55:00Z',
  //   totalRunsThisWeek: 11,
  //   branches: [
  //     {
  //       id: 'develop',
  //       name: 'develop',
  //       owner: 'Auditoria Squad',
  //       status: 'passing',
  //       updatedAt: '2025-12-13T23:55:00Z',
  //       lastCommit: 'refactor: reorganiza validações fiscais',
  //       totalScenarios: 128,
  //       passedScenarios: 120,
  //       durationMinutes: 26,
  //       reportPath: '/reports/pesquisa/index.html',
  //       runs: [
  //         {
  //           id: 'auditoria-develop-20251213-1',
  //           executedAt: '2025-12-13T23:55:00Z',
  //           passRate: 94,
  //           durationMinutes: 26,
  //           totalScenarios: 128,
  //           failedScenarios: 8,
  //           status: 'passing',
  //         },
  //         {
  //           id: 'auditoria-develop-20251212-1',
  //           executedAt: '2025-12-12T22:05:00Z',
  //           passRate: 91,
  //           durationMinutes: 27,
  //           totalScenarios: 128,
  //           failedScenarios: 11,
  //           status: 'passing',
  //         },
  //         {
  //           id: 'auditoria-develop-20251211-1',
  //           executedAt: '2025-12-11T21:25:00Z',
  //           passRate: 85,
  //           durationMinutes: 28,
  //           totalScenarios: 126,
  //           failedScenarios: 19,
  //           status: 'unstable',
  //         },
  //       ],
  //     },
  //     {
  //       id: 'master',
  //       name: 'master',
  //       owner: 'Auditoria Squad',
  //       status: 'passing',
  //       updatedAt: '2025-12-13T11:40:00Z',
  //       lastCommit: 'feat: expor log de exportações',
  //       totalScenarios: 128,
  //       passedScenarios: 123,
  //       durationMinutes: 25,
  //       reportPath: '/reports/pesquisa/index.html',
  //       runs: [
  //         {
  //           id: 'auditoria-master-20251213-1',
  //           executedAt: '2025-12-13T11:40:00Z',
  //           passRate: 96,
  //           durationMinutes: 25,
  //           totalScenarios: 128,
  //           failedScenarios: 5,
  //           status: 'passing',
  //         },
  //         {
  //           id: 'auditoria-master-20251212-1',
  //           executedAt: '2025-12-12T10:55:00Z',
  //           passRate: 93,
  //           durationMinutes: 26,
  //           totalScenarios: 128,
  //           failedScenarios: 9,
  //           status: 'passing',
  //         },
  //         {
  //           id: 'auditoria-master-20251211-1',
  //           executedAt: '2025-12-11T10:20:00Z',
  //           passRate: 87,
  //           durationMinutes: 27,
  //           totalScenarios: 126,
  //           failedScenarios: 16,
  //           status: 'unstable',
  //         },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   id: 'vitrine',
  //   name: 'Vitrine',
  //   description: 'Experiência de catálogo digital e carrinho integrado.',
  //   owner: 'Sompo',
  //   urlGit: 'https://git.datasystec.com.br/sompo/vitrine-e2e',
  //   passRate: 92,
  //   coverage: 83,
  //   lastRunAt: '2025-12-14T11:45:00Z',
  //   totalRunsThisWeek: 16,
  //   branches: [
  //     {
  //       id: 'develop',
  //       name: 'develop',
  //       owner: 'Vitrine Squad',
  //       status: 'passing',
  //       updatedAt: '2025-12-14T11:45:00Z',
  //       lastCommit: 'feat: recomendações baseadas em clusters',
  //       totalScenarios: 152,
  //       passedScenarios: 145,
  //       durationMinutes: 32,
  //       reportPath: '/reports/pesquisa/index.html',
  //       runs: [
  //         {
  //           id: 'vitrine-develop-20251214-1',
  //           executedAt: '2025-12-14T11:45:00Z',
  //           passRate: 95,
  //           durationMinutes: 32,
  //           totalScenarios: 152,
  //           failedScenarios: 7,
  //           status: 'passing',
  //         },
  //         {
  //           id: 'vitrine-develop-20251213-1',
  //           executedAt: '2025-12-13T10:50:00Z',
  //           passRate: 91,
  //           durationMinutes: 33,
  //           totalScenarios: 150,
  //           failedScenarios: 13,
  //           status: 'passing',
  //         },
  //         {
  //           id: 'vitrine-develop-20251212-1',
  //           executedAt: '2025-12-12T10:15:00Z',
  //           passRate: 87,
  //           durationMinutes: 34,
  //           totalScenarios: 150,
  //           failedScenarios: 19,
  //           status: 'unstable',
  //         },
  //       ],
  //     },
  //     {
  //       id: 'master',
  //       name: 'master',
  //       owner: 'Vitrine Squad',
  //       status: 'passing',
  //       updatedAt: '2025-12-13T20:25:00Z',
  //       lastCommit: 'fix: corrige ranking de vitrines',
  //       totalScenarios: 152,
  //       passedScenarios: 148,
  //       durationMinutes: 31,
  //       reportPath: '/reports/pesquisa/index.html',
  //       runs: [
  //         {
  //           id: 'vitrine-master-20251213-1',
  //           executedAt: '2025-12-13T20:25:00Z',
  //           passRate: 97,
  //           durationMinutes: 31,
  //           totalScenarios: 152,
  //           failedScenarios: 4,
  //           status: 'passing',
  //         },
  //         {
  //           id: 'vitrine-master-20251212-1',
  //           executedAt: '2025-12-12T19:10:00Z',
  //           passRate: 94,
  //           durationMinutes: 32,
  //           totalScenarios: 150,
  //           failedScenarios: 9,
  //           status: 'passing',
  //         },
  //         {
  //           id: 'vitrine-master-20251211-1',
  //           executedAt: '2025-12-11T18:35:00Z',
  //           passRate: 89,
  //           durationMinutes: 33,
  //           totalScenarios: 150,
  //           failedScenarios: 17,
  //           status: 'unstable',
  //         },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   id: 'faturamento',
  //   name: 'Faturamento',
  //   description: 'Pipeline de billing e reconciliação multi-empresa.',
  //   owner: 'Telerisco',
  //   urlGit: 'https://git.datasystec.com.br/telerisco/faturamento-e2e',
  //   passRate: 89,
  //   coverage: 79,
  //   lastRunAt: '2025-12-14T03:35:00Z',
  //   totalRunsThisWeek: 13,
  //   branches: [
  //     {
  //       id: 'develop',
  //       name: 'develop',
  //       owner: 'Billing Squad',
  //       status: 'unstable',
  //       updatedAt: '2025-12-14T03:35:00Z',
  //       lastCommit: 'feat: parcelamento flexível no boleto',
  //       totalScenarios: 140,
  //       passedScenarios: 123,
  //       durationMinutes: 38,
  //       reportPath: '/reports/atendimento/index.html',
  //       runs: [
  //         {
  //           id: 'faturamento-develop-20251214-1',
  //           executedAt: '2025-12-14T03:35:00Z',
  //           passRate: 88,
  //           durationMinutes: 38,
  //           totalScenarios: 140,
  //           failedScenarios: 17,
  //           status: 'unstable',
  //         },
  //         {
  //           id: 'faturamento-develop-20251213-1',
  //           executedAt: '2025-12-13T02:50:00Z',
  //           passRate: 83,
  //           durationMinutes: 39,
  //           totalScenarios: 138,
  //           failedScenarios: 23,
  //           status: 'unstable',
  //         },
  //         {
  //           id: 'faturamento-develop-20251212-1',
  //           executedAt: '2025-12-12T02:15:00Z',
  //           passRate: 79,
  //           durationMinutes: 40,
  //           totalScenarios: 138,
  //           failedScenarios: 29,
  //           status: 'failing',
  //         },
  //       ],
  //     },
  //     {
  //       id: 'master',
  //       name: 'master',
  //       owner: 'Billing Squad',
  //       status: 'passing',
  //       updatedAt: '2025-12-13T15:30:00Z',
  //       lastCommit: 'refactor: otimiza validação de NF-e',
  //       totalScenarios: 140,
  //       passedScenarios: 132,
  //       durationMinutes: 37,
  //       reportPath: '/reports/atendimento/index.html',
  //       runs: [
  //         {
  //           id: 'faturamento-master-20251213-1',
  //           executedAt: '2025-12-13T15:30:00Z',
  //           passRate: 94,
  //           durationMinutes: 37,
  //           totalScenarios: 140,
  //           failedScenarios: 8,
  //           status: 'passing',
  //         },
  //         {
  //           id: 'faturamento-master-20251212-1',
  //           executedAt: '2025-12-12T14:45:00Z',
  //           passRate: 91,
  //           durationMinutes: 36,
  //           totalScenarios: 138,
  //           failedScenarios: 13,
  //           status: 'passing',
  //         },
  //         {
  //           id: 'faturamento-master-20251211-1',
  //           executedAt: '2025-12-11T14:05:00Z',
  //           passRate: 85,
  //           durationMinutes: 37,
  //           totalScenarios: 136,
  //           failedScenarios: 20,
  //           status: 'unstable',
  //         },
  //       ],
  //     },
  //   ],
  // },
];

export function getProjectById(id: string, source: ProjectInfo[] = projects) {
  return source.find((project) => project.id === id);
}

export function getBranch(
  projectId: string,
  branchId: string,
  source: ProjectInfo[] = projects
) {
  const project = getProjectById(projectId, source);
  return project?.branches.find((branch) => branch.id === branchId);
}
