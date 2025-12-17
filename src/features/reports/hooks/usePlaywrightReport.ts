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
  file?: string;
  line?: number;
  column?: number;
  suites?: PlaywrightSuite[];
  specs?: PlaywrightSpec[];
}

interface PlaywrightSpec {
  title?: string;
  id?: string;
  file?: string;
  line?: number;
  column?: number;
  ok?: boolean;
  tags?: string[];
  tests?: PlaywrightSpecTest[];
}

interface PlaywrightSpecTest {
  title?: string;
  timeout?: number;
  annotations?: unknown[];
  expectedStatus?: string;
  projectId?: string;
  projectName?: string;
  results?: PlaywrightTestAttempt[];
}

interface PlaywrightTestAttempt {
  status: PlaywrightAttemptStatus;
  duration?: number;
  error?: PlaywrightErrorEntry | null;
  errors?: PlaywrightErrorEntry[];
  stderr?: PlaywrightStdEntry[];
  stdout?: PlaywrightStdEntry[];
  attachments?: PlaywrightAttachmentEntry[];
  workerIndex?: number;
  parallelIndex?: number;
  retry?: number;
  startTime?: string;
}

interface PlaywrightStdEntry {
  text?: string;
}

interface PlaywrightAttachmentEntry {
  name?: string;
  contentType?: string;
  path?: string;
}

interface PlaywrightErrorEntry {
  message?: string;
  value?: string;
  stack?: string;
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
  specId: string;
  specTitle?: string;
  specFile?: string;
  specLine?: number;
  specColumn?: number;
  path: string[];
  projectName?: string;
  projectId?: string;
  attempts: PlaywrightTestAttemptDetail[];
}

export interface PlaywrightReportSummary {
  stats: PlaywrightReportStats;
  tests: PlaywrightReportTest[];
  passRate: number;
  specs: PlaywrightReportSpec[];
}

export interface PlaywrightReportSpec {
  id: string;
  title: string;
  file?: string;
  line?: number;
  column?: number;
  path: string[];
  tests: PlaywrightReportTest[];
}

export interface PlaywrightTestAttemptDetail {
  status: PlaywrightAttemptStatus;
  durationMs: number;
  stdout: string[];
  stderr: string[];
  attachments: PlaywrightAttachment[];
  errors: PlaywrightErrorDetail[];
  workerIndex?: number;
  parallelIndex?: number;
  startTime?: string;
}

export interface PlaywrightAttachment {
  name: string;
  path?: string;
  contentType?: string;
}

export interface PlaywrightErrorDetail {
  message?: string;
  stack?: string;
}

function collectSpecs(
  suites: PlaywrightSuite[] = [],
  parents: string[] = []
): PlaywrightReportSpec[] {
  const specs: PlaywrightReportSpec[] = [];

  suites.forEach((suite) => {
    const suitePath = suite.title ? [...parents, suite.title] : parents;

    suite.specs?.forEach((spec, specIndex) => {
      specs.push(buildSpec(spec, suitePath, specIndex));
    });

    if (suite.suites?.length) {
      specs.push(...collectSpecs(suite.suites, suitePath));
    }
  });

  return specs;
}

function buildSpec(
  spec: PlaywrightSpec,
  suitePath: string[],
  specIndex: number
): PlaywrightReportSpec {
  const specPath = suitePath.length ? suitePath : spec.file ? [spec.file] : [];
  const specId = spec.id || [...specPath, String(specIndex)].join(' / ');
  const tests = (spec.tests ?? []).map((specTest, testIndex) =>
    buildTestFromSpec(spec, specTest, specPath, specId, specIndex, testIndex)
  );

  return {
    id: specId,
    title: spec.title ?? spec.file ?? 'Spec sem nome',
    file: spec.file,
    line: spec.line,
    column: spec.column,
    path: specPath,
    tests,
  };
}

function buildTestFromSpec(
  spec: PlaywrightSpec,
  specTest: PlaywrightSpecTest,
  parentPath: string[],
  specId: string,
  specIndex: number,
  testIndex: number
): PlaywrightReportTest {
  const attempts = specTest.results ?? [];
  const status = deriveTestStatus(attempts);
  const durationMs = attempts.reduce(
    (acc, attempt) => acc + (attempt.duration ?? 0),
    0
  );
  const errorMessage = extractErrorMessage(attempts);
  const fallbackId = `${specId}#${testIndex}`;
  const attemptDetails = attempts.map((attempt) => buildAttemptDetail(attempt));
  const scenarioTitle = spec.title ?? spec.file ?? `Cenário ${specIndex + 1}`;
  const testTitle = specTest.title?.trim() || scenarioTitle;
  const contextPath = parentPath.length
    ? parentPath
    : spec.file
    ? [spec.file]
    : [];
  const fullTitleParts = [...contextPath, scenarioTitle];

  if (specTest.projectName) {
    fullTitleParts.push(`Projeto ${specTest.projectName}`);
  }

  return {
    id:
      [specTest.projectId, specTest.projectName, specId, testIndex]
        .filter(Boolean)
        .join('-') || fallbackId,
    title: testTitle,
    fullTitle: fullTitleParts.join(' / '),
    status,
    durationMs,
    retries: Math.max(0, attempts.length - 1),
    errorMessage,
    specId,
    specTitle: spec.title,
    specFile: spec.file,
    specLine: spec.line,
    specColumn: spec.column,
    path: contextPath,
    projectName: specTest.projectName,
    projectId: specTest.projectId,
    attempts: attemptDetails,
  };
}

function buildAttemptDetail(
  attempt: PlaywrightTestAttempt
): PlaywrightTestAttemptDetail {
  return {
    status: attempt.status,
    durationMs: attempt.duration ?? 0,
    stdout: normalizeLogEntries(attempt.stdout),
    stderr: normalizeLogEntries(attempt.stderr),
    attachments: (attempt.attachments ?? []).map((attachment, index) => ({
      name: attachment.name || `Anexo ${index + 1}`,
      path: attachment.path,
      contentType: attachment.contentType,
    })),
    errors: normalizeErrors(attempt),
    workerIndex: attempt.workerIndex,
    parallelIndex: attempt.parallelIndex,
    startTime: attempt.startTime,
  };
}

function normalizeLogEntries(entries?: PlaywrightStdEntry[]) {
  return (entries ?? [])
    .map((entry) => entry.text?.trim())
    .filter((text): text is string => Boolean(text && text.length));
}

function normalizeErrors(
  attempt: PlaywrightTestAttempt
): PlaywrightErrorDetail[] {
  const mainError = attempt.error ? [attempt.error] : [];
  const otherErrors = attempt.errors ?? [];
  const merged = [...mainError, ...otherErrors];

  return merged
    .map((error) => ({
      message: error.message ?? error.value,
      stack: error.stack,
    }))
    .filter((error) => Boolean(error.message || error.stack));
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

export async function fetchPlaywrightReport(
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
  const specs = collectSpecs(payload.suites);
  const tests = specs.flatMap((spec) => spec.tests);

  if (!tests.length) {
    return null;
  }

  const stats = buildStatsFromTests(payload.stats, tests);

  return {
    stats,
    tests,
    specs,
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
