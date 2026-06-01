import { useEffect, useState } from "react";
import { Panel } from "@/components/Panel";

export function DiscoveryPanel({
  activeSearch,
  matchedPaths,
  onClearSearch,
  onClearSelected,
  onSearchSubmit,
  onSelectVisible,
  onTogglePath,
  selectedPaths,
  style,
  visiblePaths
}) {
  const [draftSearch, setDraftSearch] = useState(activeSearch);

  useEffect(() => {
    setDraftSearch(activeSearch);
  }, [activeSearch]);

  function submitSearch(event) {
    event.preventDefault();
    onSearchSubmit(draftSearch.trim());
  }

  function clearSearch() {
    setDraftSearch("");
    onClearSearch();
  }

  return (
    <Panel style={style} title="Discovery & Field Selection" subtitle="Search semantically adjacent key names.">
      <form className="flex gap-2" onSubmit={submitSearch}>
        <input
          className="min-w-0 flex-1 rounded-md border border-stone-700 bg-[#0d0e10] px-3 py-2 text-sm text-stone-100 outline-none ring-emerald-400/40 placeholder:text-stone-500 focus:ring-2"
          placeholder="Try mail, price, profile id..."
          value={draftSearch}
          onChange={(event) => setDraftSearch(event.target.value)}
        />
        <button
          className="rounded-md bg-emerald-400 px-3 py-2 text-sm font-semibold text-stone-950 transition hover:bg-emerald-300"
          type="submit"
        >
          Search
        </button>
        <button
          className="rounded-md border border-stone-700 px-3 py-2 text-sm text-stone-200 transition hover:border-stone-500"
          type="button"
          onClick={clearSearch}
        >
          Clear
        </button>
        <button
          className="rounded-md border border-stone-700 px-3 py-2 text-sm text-stone-200 transition hover:border-stone-500"
          type="button"
          onClick={onSelectVisible}
        >
          Select
        </button>
      </form>

      <button
        className="mt-3 rounded-md border border-stone-700 px-3 py-2 text-sm text-stone-200 transition hover:border-stone-500"
        type="button"
        onClick={onClearSelected}
      >
        Clear selected fields
      </button>

      <div className="mt-3 rounded-md border border-stone-800 bg-[#0d0e10] px-3 py-2 text-xs text-stone-400">
        Search applies when you press Enter or click Search. Matches stay active until Clear is clicked.
      </div>

      <div className="mt-4 min-h-0 flex-1 overflow-auto rounded-md border border-stone-800 bg-[#0d0e10]">
        {visiblePaths.length > 0 ? (
          <PathList
            matchedPaths={matchedPaths}
            onTogglePath={onTogglePath}
            search={activeSearch}
            selectedPaths={selectedPaths}
            visiblePaths={visiblePaths}
          />
        ) : (
          <div className="p-6 text-sm text-stone-400">No matching paths found.</div>
        )}
      </div>
    </Panel>
  );
}

function PathList({ matchedPaths, onTogglePath, search, selectedPaths, visiblePaths }) {
  return (
    <ul className="divide-y divide-stone-800">
      {visiblePaths.map((path) => {
        const selected = selectedPaths.has(path);
        const matched = matchedPaths.has(path);
        return (
          <li key={path}>
            <label className="flex cursor-pointer items-start gap-3 px-3 py-2.5 transition hover:bg-stone-900">
              <input
                className="mt-1 h-4 w-4 accent-emerald-400"
                type="checkbox"
                checked={selected || matched}
                onChange={() => onTogglePath(path)}
              />
              <span className="min-w-0 flex-1">
                <span className="block break-all font-mono text-sm text-stone-100">{path}</span>
                {matched && search.trim() ? (
                  <span className="mt-1 inline-block rounded bg-amber-300/15 px-1.5 py-0.5 text-[11px] font-medium text-amber-200">
                    fuzzy match
                  </span>
                ) : null}
              </span>
            </label>
          </li>
        );
      })}
    </ul>
  );
}
