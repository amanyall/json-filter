export function InlineMessage({ children, tone }) {
  const className =
    tone === "error"
      ? "border-red-400/30 bg-red-500/10 text-red-200"
      : "border-emerald-400/30 bg-emerald-500/10 text-emerald-200";

  return <div className={`rounded-md border px-3 py-2 text-sm ${className}`}>{children}</div>;
}
