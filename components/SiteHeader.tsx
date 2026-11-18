"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/quote", label: "Quote" },
  { href: "/jobs", label: "Jobs" },
];

export function SiteHeader() {
  const pathname = usePathname();
  if (pathname === "/login") return null;

  return (
    <header className="border-b border-line bg-card">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-6 px-6 py-4">
        <Link href="/" className="leading-tight">
          <span className="block text-[11px] font-medium uppercase tracking-[0.18em] text-accent">
            MCI Digital B2B
          </span>
          <span className="text-lg font-semibold tracking-tight">Hearth & Circuit</span>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-3 py-1.5 hover:bg-accent-soft"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
