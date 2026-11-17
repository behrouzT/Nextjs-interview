import { JobsBoard } from "@/components/JobsBoard";
import { INTERVIEW_TODAY } from "@/lib/jobs/constants";
import { formatIsoDate } from "@/lib/jobs/format";

export default function JobsPage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-6 py-10">
      <div className="max-w-2xl">
        <p className="text-sm font-medium uppercase tracking-[0.16em] text-accent">Task 2</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Jobs on the bench</h1>
        <p className="mt-3 leading-7 text-muted">
          Today on this desk is {formatIsoDate(INTERVIEW_TODAY)}. Search should narrow the
          list as you type. The cards describe the jobs currently shown. The full rules are
          in the README, and <code>npm test</code> checks them.
        </p>
      </div>
      <JobsBoard />
    </main>
  );
}
