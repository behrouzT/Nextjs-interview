import type { Job } from "@/lib/jobs/types";

export const JOBS: Job[] = [
  {
    id: "j5",
    title: "Keyboard replacement",
    customer: "Cafe Sol",
    status: "open",
    dueDate: "2026-11-20",
    estimatedCents: 7500,
  },
  {
    id: "j2",
    title: "Battery swelling",
    customer: "Northwind Lab",
    status: "in_progress",
    dueDate: "2026-11-14",
    estimatedCents: 9500,
  },
  {
    id: "j4",
    title: "Printer jam",
    customer: "Cafe Sol",
    status: "cancelled",
    dueDate: "2026-11-12",
    estimatedCents: 4000,
  },
  {
    id: "j1",
    title: "Replace laptop screen",
    customer: "Aline Moreau",
    status: "open",
    dueDate: "2026-11-16",
    estimatedCents: 18000,
  },
  {
    id: "j6",
    title: "Screen calibration",
    customer: "Bright Pixel",
    status: "in_progress",
    dueDate: "2026-11-18",
    estimatedCents: 5000,
  },
  {
    id: "j3",
    title: "Data recovery",
    customer: "Aline Moreau",
    status: "done",
    dueDate: "2026-11-10",
    estimatedCents: 24000,
  },
];
