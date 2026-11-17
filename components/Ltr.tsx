export function Ltr({ children }: { children: string }) {
  return (
    <code
      dir="ltr"
      className="mx-0.5 inline-block rounded bg-background px-1.5 py-0.5 font-mono text-[0.92em] leading-6"
    >
      {children}
    </code>
  );
}
