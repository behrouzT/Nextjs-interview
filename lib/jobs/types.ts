export type JobStatus = "open" | "in_progress" | "done" | "cancelled";

export type StatusFilter = JobStatus | "all";

export type Job = {
  id: string;
  title: string;
  customer: string;
  status: JobStatus;
  dueDate: string;
  estimatedCents: number;
};

export type JobQuery = {
  search: string;
  status: StatusFilter;
};

export type JobSummary = {
  openCount: number;
  overdueCount: number;
  activeRevenueCents: number;
};
