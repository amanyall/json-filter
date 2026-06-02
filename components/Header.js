export function Header({ discoveredCount, activeCount }) {
  return (
    <header className="border-b border-stone-800 bg-[#151619] px-4 py-4 sm:px-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">
            Internal developer utility
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-normal text-stone-50">
            JSON-Filter & Discovery Hub
          </h1>
        </div>
        <div className="flex flex-wrap gap-2 text-xs text-stone-400">
          <span>{discoveredCount} discovered paths</span>
          <span>{activeCount} active selections</span>
          <span>Made by Aman Pandey</span>
        </div>
      </div>
    </header>
  );
}
