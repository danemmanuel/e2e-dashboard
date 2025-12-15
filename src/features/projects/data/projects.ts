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
  passRate: number;
  coverage: number;
  lastRunAt: string;
  totalRunsThisWeek: number;
  branches: BranchInfo[];
}

export const projects: ProjectInfo[] = [
  {
    id: 'consulta',
    name: 'Consulta',
    description: 'Fluxo de consulta omnichannel com integração legado.',
    owner: 'Sompo',
    passRate: 96,
    coverage: 82,
    lastRunAt: '2025-12-14T02:15:00Z',
    totalRunsThisWeek: 18,
    branches: [
      {
        id: 'develop',
        name: 'develop',
        owner: 'Consulta Squad',
        status: 'passing',
        updatedAt: '2025-12-14T10:05:00Z',
        lastCommit: 'chore: ajustar mocks do gateway',
        totalScenarios: 184,
        passedScenarios: 179,
        durationMinutes: 36,
        reportPath: '/reports/consulta/index.html',
        runs: [
          {
            id: 'consulta-develop-20251214-1',
            executedAt: '2025-12-14T10:05:00Z',
            passRate: 97,
            durationMinutes: 36,
            totalScenarios: 184,
            failedScenarios: 5,
            status: 'passing',
          },
          {
            id: 'consulta-develop-20251213-1',
            executedAt: '2025-12-13T08:15:00Z',
            passRate: 94,
            durationMinutes: 35,
            totalScenarios: 184,
            failedScenarios: 11,
            status: 'passing',
          },
          {
            id: 'consulta-develop-20251212-1',
            executedAt: '2025-12-12T07:55:00Z',
            passRate: 91,
            durationMinutes: 37,
            totalScenarios: 180,
            failedScenarios: 16,
            status: 'unstable',
          },
        ],
      },
      {
        id: 'master',
        name: 'master',
        owner: 'Consulta Squad',
        status: 'unstable',
        updatedAt: '2025-12-13T22:45:00Z',
        lastCommit: 'feat: sanitize payload antes de enviar',
        totalScenarios: 184,
        passedScenarios: 171,
        durationMinutes: 34,
        reportPath: '/reports/consulta/index.html',
        runs: [
          {
            id: 'consulta-master-20251213-1',
            executedAt: '2025-12-13T22:45:00Z',
            passRate: 93,
            durationMinutes: 34,
            totalScenarios: 184,
            failedScenarios: 13,
            status: 'unstable',
          },
          {
            id: 'consulta-master-20251212-1',
            executedAt: '2025-12-12T21:30:00Z',
            passRate: 96,
            durationMinutes: 33,
            totalScenarios: 184,
            failedScenarios: 8,
            status: 'passing',
          },
          {
            id: 'consulta-master-20251211-1',
            executedAt: '2025-12-11T22:50:00Z',
            passRate: 88,
            durationMinutes: 35,
            totalScenarios: 182,
            failedScenarios: 22,
            status: 'failing',
          },
        ],
      },
      {
        id: 'TELERISCO-1234',
        name: 'TELERISCO-1234',
        owner: 'Consulta Squad',
        status: 'failing',
        updatedAt: '2025-12-12T18:10:00Z',
        lastCommit: 'fix: corrige mapeamento de variáveis',
        totalScenarios: 122,
        passedScenarios: 89,
        durationMinutes: 21,
        reportPath: '/reports/consulta/index.html',
        runs: [
          {
            id: 'consulta-telerisco-1234-20251212-1',
            executedAt: '2025-12-12T18:10:00Z',
            passRate: 73,
            durationMinutes: 21,
            totalScenarios: 122,
            failedScenarios: 33,
            status: 'failing',
          },
          {
            id: 'consulta-telerisco-1234-20251211-1',
            executedAt: '2025-12-11T16:40:00Z',
            passRate: 82,
            durationMinutes: 22,
            totalScenarios: 122,
            failedScenarios: 22,
            status: 'unstable',
          },
          {
            id: 'consulta-telerisco-1234-20251210-1',
            executedAt: '2025-12-10T17:05:00Z',
            passRate: 85,
            durationMinutes: 23,
            totalScenarios: 122,
            failedScenarios: 18,
            status: 'unstable',
          },
        ],
      },
    ],
  },
  {
    id: 'pesquisa',
    name: 'Pesquisa',
    description: 'Jornada de pesquisa e discovery na plataforma.',
    owner: 'Telerisco',
    passRate: 91,
    coverage: 78,
    lastRunAt: '2025-12-14T05:40:00Z',
    totalRunsThisWeek: 12,
    branches: [
      {
        id: 'develop',
        name: 'develop',
        owner: 'Pesquisa Squad',
        status: 'passing',
        updatedAt: '2025-12-14T07:25:00Z',
        lastCommit: 'feat: filtros por segmento',
        totalScenarios: 146,
        passedScenarios: 139,
        durationMinutes: 28,
        reportPath: '/reports/pesquisa/index.html',
        runs: [
          {
            id: 'pesquisa-develop-20251214-1',
            executedAt: '2025-12-14T07:25:00Z',
            passRate: 95,
            durationMinutes: 28,
            totalScenarios: 146,
            failedScenarios: 7,
            status: 'passing',
          },
          {
            id: 'pesquisa-develop-20251213-1',
            executedAt: '2025-12-13T06:40:00Z',
            passRate: 92,
            durationMinutes: 27,
            totalScenarios: 144,
            failedScenarios: 11,
            status: 'passing',
          },
          {
            id: 'pesquisa-develop-20251212-1',
            executedAt: '2025-12-12T06:10:00Z',
            passRate: 88,
            durationMinutes: 29,
            totalScenarios: 144,
            failedScenarios: 17,
            status: 'unstable',
          },
        ],
      },
      {
        id: 'master',
        name: 'master',
        owner: 'Pesquisa Squad',
        status: 'passing',
        updatedAt: '2025-12-13T23:05:00Z',
        lastCommit: 'refactor: reorganiza steps de login',
        totalScenarios: 146,
        passedScenarios: 142,
        durationMinutes: 29,
        reportPath: '/reports/pesquisa/index.html',
        runs: [
          {
            id: 'pesquisa-master-20251213-1',
            executedAt: '2025-12-13T23:05:00Z',
            passRate: 97,
            durationMinutes: 29,
            totalScenarios: 146,
            failedScenarios: 4,
            status: 'passing',
          },
          {
            id: 'pesquisa-master-20251212-1',
            executedAt: '2025-12-12T22:20:00Z',
            passRate: 94,
            durationMinutes: 28,
            totalScenarios: 146,
            failedScenarios: 9,
            status: 'passing',
          },
          {
            id: 'pesquisa-master-20251211-1',
            executedAt: '2025-12-11T21:35:00Z',
            passRate: 89,
            durationMinutes: 30,
            totalScenarios: 144,
            failedScenarios: 16,
            status: 'unstable',
          },
        ],
      },
      {
        id: 'TELERISCO-5678',
        name: 'TELERISCO-5678',
        owner: 'Pesquisa Squad',
        status: 'unstable',
        updatedAt: '2025-12-13T19:45:00Z',
        lastCommit: 'feat: trackear eventos de busca',
        totalScenarios: 102,
        passedScenarios: 93,
        durationMinutes: 25,
        reportPath: '/reports/pesquisa/index.html',
        runs: [
          {
            id: 'pesquisa-telerisco-5678-20251213-1',
            executedAt: '2025-12-13T19:45:00Z',
            passRate: 91,
            durationMinutes: 25,
            totalScenarios: 102,
            failedScenarios: 9,
            status: 'unstable',
          },
          {
            id: 'pesquisa-telerisco-5678-20251212-1',
            executedAt: '2025-12-12T18:05:00Z',
            passRate: 86,
            durationMinutes: 24,
            totalScenarios: 102,
            failedScenarios: 14,
            status: 'unstable',
          },
          {
            id: 'pesquisa-telerisco-5678-20251211-1',
            executedAt: '2025-12-11T17:15:00Z',
            passRate: 79,
            durationMinutes: 26,
            totalScenarios: 100,
            failedScenarios: 21,
            status: 'failing',
          },
        ],
      },
    ],
  },
  {
    id: 'atendimento',
    name: 'Atendimento',
    description: 'Canal conversacional com roteamento inteligente.',
    owner: 'Telerisco',
    passRate: 88,
    coverage: 74,
    lastRunAt: '2025-12-14T01:20:00Z',
    totalRunsThisWeek: 15,
    branches: [
      {
        id: 'develop',
        name: 'develop',
        owner: 'CX Squad',
        status: 'unstable',
        updatedAt: '2025-12-14T08:15:00Z',
        lastCommit: 'fix: ajustar fallback do bot',
        totalScenarios: 164,
        passedScenarios: 146,
        durationMinutes: 33,
        reportPath: '/reports/atendimento/index.html',
        runs: [
          {
            id: 'atendimento-develop-20251214-1',
            executedAt: '2025-12-14T08:15:00Z',
            passRate: 89,
            durationMinutes: 33,
            totalScenarios: 164,
            failedScenarios: 18,
            status: 'unstable',
          },
          {
            id: 'atendimento-develop-20251213-1',
            executedAt: '2025-12-13T07:50:00Z',
            passRate: 85,
            durationMinutes: 34,
            totalScenarios: 164,
            failedScenarios: 25,
            status: 'unstable',
          },
          {
            id: 'atendimento-develop-20251212-1',
            executedAt: '2025-12-12T08:05:00Z',
            passRate: 78,
            durationMinutes: 35,
            totalScenarios: 160,
            failedScenarios: 35,
            status: 'failing',
          },
        ],
      },
      {
        id: 'master',
        name: 'master',
        owner: 'CX Squad',
        status: 'passing',
        updatedAt: '2025-12-13T21:50:00Z',
        lastCommit: 'chore: atualizar libs de canais',
        totalScenarios: 164,
        passedScenarios: 155,
        durationMinutes: 35,
        reportPath: '/reports/atendimento/index.html',
        runs: [
          {
            id: 'atendimento-master-20251213-1',
            executedAt: '2025-12-13T21:50:00Z',
            passRate: 94,
            durationMinutes: 35,
            totalScenarios: 164,
            failedScenarios: 9,
            status: 'passing',
          },
          {
            id: 'atendimento-master-20251212-1',
            executedAt: '2025-12-12T20:55:00Z',
            passRate: 92,
            durationMinutes: 34,
            totalScenarios: 164,
            failedScenarios: 13,
            status: 'passing',
          },
          {
            id: 'atendimento-master-20251211-1',
            executedAt: '2025-12-11T20:30:00Z',
            passRate: 86,
            durationMinutes: 36,
            totalScenarios: 162,
            failedScenarios: 23,
            status: 'unstable',
          },
        ],
      },
      {
        id: 'TELERISCO-9012',
        name: 'TELERISCO-9012',
        owner: 'CX Squad',
        status: 'failing',
        updatedAt: '2025-12-13T17:05:00Z',
        lastCommit: 'feat: integra novo provedor',
        totalScenarios: 88,
        passedScenarios: 61,
        durationMinutes: 18,
        reportPath: '/reports/atendimento/index.html',
        runs: [
          {
            id: 'atendimento-telerisco-9012-20251213-1',
            executedAt: '2025-12-13T17:05:00Z',
            passRate: 69,
            durationMinutes: 18,
            totalScenarios: 88,
            failedScenarios: 27,
            status: 'failing',
          },
          {
            id: 'atendimento-telerisco-9012-20251212-1',
            executedAt: '2025-12-12T16:20:00Z',
            passRate: 74,
            durationMinutes: 19,
            totalScenarios: 88,
            failedScenarios: 23,
            status: 'unstable',
          },
          {
            id: 'atendimento-telerisco-9012-20251211-1',
            executedAt: '2025-12-11T15:40:00Z',
            passRate: 81,
            durationMinutes: 20,
            totalScenarios: 86,
            failedScenarios: 16,
            status: 'unstable',
          },
        ],
      },
    ],
  },
];

export function getProjectById(id: string) {
  return projects.find((project) => project.id === id);
}

export function getBranch(projectId: string, branchId: string) {
  const project = getProjectById(projectId);
  return project?.branches.find((branch) => branch.id === branchId);
}
