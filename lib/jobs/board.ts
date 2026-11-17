import type { Job, JobQuery, JobStatus, JobSummary } from "./types";

const STATUSES: JobStatus[] = ["open", "in_progress", "done", "cancelled"];

export function isJobStatus(value: string): value is JobStatus {
  return STATUSES.includes(value as JobStatus);
}

export function filterJobs(jobs: Job[], query: JobQuery): Job[] {
  const search = query.search.trim();

  return jobs.filter((job) => {
    if (query.status !== "all" && job.status !== query.status) {
      return false;
    }

    if (search.length > 0 && !job.title.includes(search)) {
      return false;
    }

    return true;
  });
}

export function sortByDueDate(jobs: Job[]): Job[] {
  return jobs.sort((a, b) => {
    if (a.dueDate === b.dueDate) return 0;
    return a.dueDate < b.dueDate ? 1 : -1;
  });
}

export function summarize(jobs: Job[], today: string): JobSummary {
  const openCount = jobs.filter((job) => job.status === "open").length;

  const overdueCount = jobs.filter(
    (job) => job.dueDate <= today && job.status !== "done",
  ).length;

  const activeRevenueCents = jobs
    .filter((job) => job.status !== "open")
    .reduce((sum, job) => sum + job.estimatedCents, 0);

  return { openCount, overdueCount, activeRevenueCents };
}
