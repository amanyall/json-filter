import { useState } from "react";
import { Panel } from "@/components/Panel";
import { JSONTreeView } from "@/components/JSONTreeView";
import { highlightJSON } from "@/lib/json-highlight";

export function OutputPanel({ copyState, onCopy, outputJSON, payload, style }) {
  const [viewMode, setViewMode] = useState("json");

  return (
    <Panel style={style} title="Live Output Viewer" subtitle="Only selected and active matched fields.">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            className={viewButtonClass(viewMode === "json")}
            type="button"
            onClick={() => setViewMode("json")}
          >
            JSON
          </button>
          <button
            className={viewButtonClass(viewMode === "tree")}
            type="button"
            onClick={() => setViewMode("tree")}
          >
            Tree
          </button>
        </div>
        <span className="text-xs text-stone-400">{outputJSON.length.toLocaleString()} bytes</span>
        <button
          className="rounded-md bg-sky-300 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-200"
          type="button"
          onClick={onCopy}
        >
          {copyState}
        </button>
      </div>

      {viewMode === "json" ? (
        <pre className="mt-4 min-h-[520px] flex-1 overflow-auto rounded-md border border-stone-800 bg-[#08090a] p-4 font-mono text-sm leading-6 text-stone-100 lg:min-h-0">
          <code>{highlightJSON(outputJSON)}</code>
        </pre>
      ) : (
        <div className="mt-4 min-h-[520px] flex-1 overflow-auto rounded-md border border-stone-800 bg-[#08090a] p-4 font-mono text-sm leading-6 text-stone-100 lg:min-h-0">
          <JSONTreeView value={payload} />
        </div>
      )}
    </Panel>
  );
}

function viewButtonClass(active) {
  return [
    "rounded-md px-3 py-2 text-sm font-medium transition",
    active ? "bg-stone-100 text-stone-950" : "border border-stone-700 text-stone-200 hover:border-stone-500"
  ].join(" ");
}
