import { JOBS } from "@/data/jobs";
import { INTERVIEW_TODAY } from "@/lib/jobs/constants";
import { filterJobs, isJobStatus, sortByDueDate, summarize } from "@/lib/jobs/board";
import type { StatusFilter } from "@/lib/jobs/types";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const search = url.searchParams.get("q") ?? "";
  const statusParam = url.searchParams.get("status") ?? "all";
  const today = url.searchParams.get("today") ?? INTERVIEW_TODAY;

  if (statusParam !== "all" && !isJobStatus(statusParam)) {
    return Response.json({
      jobs: [],
      summary: { openCount: 0, overdueCount: 0, activeRevenueCents: 0 },
    });
  }

  const status = statusParam as StatusFilter;
  const jobs = sortByDueDate(filterJobs(JOBS, { search, status }));

  return Response.json({
    jobs,
    summary: summarize(jobs, today),
  });
}
