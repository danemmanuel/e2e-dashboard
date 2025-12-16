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
  stats?: PlaywrightRawStats;
  suites?: PlaywrightSuite[];
}

interface PlaywrightRawStats {
  expected?: number;
  skipped?: number;
  unexpected?: number;
  flaky?: number;
  duration?: number;
}

interface PlaywrightSuite {
  title?: string;
  suites?: PlaywrightSuite[];
  specs?: PlaywrightSpec[];
}

interface PlaywrightSpec {
  title?: string;
  id?: string;
  tests?: PlaywrightSpecTest[];
}

interface PlaywrightSpecTest {
  projectId?: string;
  projectName?: string;
  results?: PlaywrightTestAttempt[];
}

interface PlaywrightTestAttempt {
  status: PlaywrightAttemptStatus;
  duration?: number;
  error?: { message?: string } | null;
  errors?: { message?: string }[];
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

function collectTests(
  suites: PlaywrightSuite[] = [],
  parents: string[] = []
): PlaywrightReportTest[] {
  const tests: PlaywrightReportTest[] = [];

  suites.forEach((suite) => {
    const suitePath = suite.title ? [...parents, suite.title] : parents;
    suite.specs?.forEach((spec) => {
      const specPath = spec.title ? [...suitePath, spec.title] : suitePath;

      spec.tests?.forEach((specTest, index) => {
        const attempts = specTest.results ?? [];
        const status = deriveTestStatus(attempts);
        const durationMs = attempts.reduce(
          (acc, attempt) => acc + (attempt.duration ?? 0),
          0
        );
        const errorMessage = extractErrorMessage(attempts);
        const projectLabel = specTest.projectName ?? specTest.projectId;
        const testTitle = projectLabel
          ? `${spec.title ?? 'Sem titulo'} [${projectLabel}]`
          : spec.title ?? 'Sem titulo';
        const idCandidates = [spec.id, projectLabel];
        const fallbackId = [...specPath, String(index)].join(' / ');

        tests.push({
          id: idCandidates.filter(Boolean).join('-') || fallbackId,
          title: testTitle,
          fullTitle: [...suitePath, testTitle].filter(Boolean).join(' / '),
          status,
          durationMs,
          retries: Math.max(0, attempts.length - 1),
          errorMessage,
        });
      });
    });

    if (suite.suites?.length) {
      tests.push(...collectTests(suite.suites, suitePath));
    }
  });

  return tests;
}

function extractErrorMessage(attempts: PlaywrightTestAttempt[]) {
  for (const attempt of attempts) {
    const errorMessage =
      attempt.error?.message ??
      attempt.errors?.find((entry) => entry.message)?.message;
    if (errorMessage) {
      return errorMessage;
    }
  }

  return undefined;
}

function buildStatsFromTests(
  rawStats: PlaywrightRawStats | undefined,
  tests: PlaywrightReportTest[]
): PlaywrightReportStats {
  const counters = tests.reduce(
    (acc, test) => {
      acc.total += 1;
      acc.duration += test.durationMs;

      if (test.status === 'passed') {
        acc.passed += 1;
      } else if (test.status === 'failed') {
        acc.failed += 1;
      } else if (test.status === 'flaky') {
        acc.flaky += 1;
      } else {
        acc.skipped += 1;
      }

      return acc;
    },
    { total: 0, passed: 0, failed: 0, flaky: 0, skipped: 0, duration: 0 }
  );

  return {
    total: counters.total,
    passed: counters.passed,
    failed: counters.failed,
    flaky: counters.flaky,
    skipped: counters.skipped,
    unexpected: rawStats?.unexpected ?? counters.failed,
    duration:
      typeof rawStats?.duration === 'number'
        ? Math.round(rawStats.duration)
        : counters.duration,
  };
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
  const tests = collectTests(payload.suites);

  if (!tests.length) {
    return null;
  }

  const stats = buildStatsFromTests(payload.stats, tests);

  return {
    stats,
    tests,
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
