import { useQuery } from '@tanstack/react-query';
import type {
  BranchInfo,
  BranchRun,
  BranchStatus,
  ProjectInfo,
} from '../../projects/data/projects.ts';
import {
  buildBranchReportJsonPath,
  buildBranchReportPath,
} from '../../projects/data/projects.ts';

interface PlaywrightReportJson {
  stats?: PlaywrightReportStats;
  suites?: PlaywrightSuite[];
}

interface PlaywrightSuite {
  title: string;
  suites?: PlaywrightSuite[];
  tests?: PlaywrightJsonTest[];
}

interface PlaywrightJsonTest {
  title: string;
  testId?: string;
  results?: PlaywrightTestAttempt[];
}

interface PlaywrightTestAttempt {
  status: PlaywrightAttemptStatus;
  duration?: number;
  error?: { message?: string };
  stderr?: string[];
}

type PlaywrightAttemptStatus =
  | 'passed'
  | 'failed'
  | 'timedOut'
  | 'skipped'
  | 'interrupted'
  | 'crashed';

export type PlaywrightTestStatus = 'passed' | 'failed' | 'flaky' | 'skipped';

export interface PlaywrightReportStats {
  total: number;
  passed: number;
  failed: number;
  flaky: number;
  skipped: number;
  unexpected: number;
  duration: number;
}

export interface PlaywrightReportTest {
  id: string;
  title: string;
  fullTitle: string;
  status: PlaywrightTestStatus;
  durationMs: number;
  retries: number;
  errorMessage?: string;
}

export interface PlaywrightReportSummary {
  stats: PlaywrightReportStats;
  tests: PlaywrightReportTest[];
  passRate: number;
}

function toStats(raw?: PlaywrightReportStats): PlaywrightReportStats {
  return {
    total: raw?.total ?? 0,
    passed: raw?.passed ?? 0,
    failed: raw?.failed ?? 0,
    flaky: raw?.flaky ?? 0,
    skipped: raw?.skipped ?? 0,
    unexpected: raw?.unexpected ?? 0,
    duration: raw?.duration ?? 0,
  };
}

function collectTests(
  suites: PlaywrightSuite[] = [],
  parents: string[] = []
): PlaywrightReportTest[] {
  const tests: PlaywrightReportTest[] = [];

  suites.forEach((suite) => {
    const suitePath = suite.title ? [...parents, suite.title] : parents;
    suite.tests?.forEach((test) => {
      const attempts = test.results ?? [];
      const status = deriveTestStatus(attempts);
      const durationMs = attempts.reduce(
        (acc, attempt) => acc + (attempt.duration ?? 0),
        0
      );
      const errorMessage = attempts.find((attempt) => attempt.error)?.error
        ?.message;

      tests.push({
        id: test.testId ?? [...suitePath, test.title].join(' / '),
        title: test.title,
        fullTitle: [...suitePath, test.title].filter(Boolean).join(' / '),
        status,
        durationMs,
        retries: Math.max(0, attempts.length - 1),
        errorMessage,
      });
    });

    if (suite.suites?.length) {
      tests.push(...collectTests(suite.suites, suitePath));
    }
  });

  return tests;
}

function deriveTestStatus(
  attempts: PlaywrightTestAttempt[]
): PlaywrightTestStatus {
  if (!attempts.length) return 'skipped';
  const hasFailed = attempts.some((attempt) =>
    ['failed', 'timedOut', 'interrupted', 'crashed'].includes(attempt.status)
  );
  const hasPassed = attempts.some((attempt) => attempt.status === 'passed');

  if (hasFailed && hasPassed) {
    return 'flaky';
  }

  if (hasFailed) {
    return 'failed';
  }

  if (hasPassed) {
    return 'passed';
  }

  return 'skipped';
}

function computePassRate(stats: PlaywrightReportStats) {
  if (!stats.total) return 0;
  return Math.round((stats.passed / stats.total) * 100);
}

async function fetchPlaywrightReport(
  project: ProjectInfo,
  branchId: string
): Promise<PlaywrightReportSummary | null> {
  const jsonPath = buildBranchReportJsonPath(project, branchId);
  const response = await fetch(jsonPath, {
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }

    throw new Error(
      `Falha ao carregar report do Playwright (${response.status})`
    );
  }

  const payload = (await response.json()) as PlaywrightReportJson;
  const stats = toStats(payload.stats);

  if (!stats.total) {
    return null;
  }

  return {
    stats,
    tests: collectTests(payload.suites),
    passRate: computePassRate(stats),
  };
}

export function deriveBranchStatusFromStats(
  stats: PlaywrightReportStats
): BranchStatus {
  if (stats.failed === 0 && stats.unexpected === 0) {
    return 'passing';
  }

  if (stats.passed > 0) {
    return 'unstable';
  }

  return 'failing';
}

export function buildRunFromStats(
  stats: PlaywrightReportStats,
  branch: Pick<BranchInfo, 'updatedAt' | 'id'>
): BranchRun {
  const durationMinutes = Math.max(1, Math.round(stats.duration / 60000));

  return {
    id: `${branch.id}-${branch.updatedAt}`,
    executedAt: branch.updatedAt,
    passRate: computePassRate(stats),
    durationMinutes,
    totalScenarios: stats.total,
    failedScenarios: stats.failed,
    status: deriveBranchStatusFromStats(stats),
  };
}

export function usePlaywrightReport(project?: ProjectInfo, branchId?: string) {
  return useQuery<PlaywrightReportSummary | null>({
    queryKey: ['playwright-report', project?.id, project?.reportSlug, branchId],
    enabled: Boolean(project && branchId),
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
    retry: false,
    queryFn: () => fetchPlaywrightReport(project!, branchId!),
  });
}

export function getReportIndexPath(project: ProjectInfo, branchId: string) {
  return buildBranchReportPath(project, branchId);
}
