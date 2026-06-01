import { InlineMessage } from "@/components/InlineMessage";
import { Panel } from "@/components/Panel";

export function InputPanel({
  activeTab,
  curlCommand,
  isFetching,
  onCurlChange,
  onFetchCurl,
  onRawJSONChange,
  onTabChange,
  parseError,
  rawJSON,
  requestError,
  requestMeta,
  style
}) {
  return (
    <Panel style={style} title="Input Source" subtitle="Paste a payload or fetch one server-side.">
      <div className="grid grid-cols-2 rounded-md border border-stone-700 bg-stone-950 p-1">
        <button className={tabClass(activeTab === "curl")} type="button" onClick={() => onTabChange("curl")}>
          cURL Input
        </button>
        <button className={tabClass(activeTab === "json")} type="button" onClick={() => onTabChange("json")}>
          Raw JSON
        </button>
      </div>

      {activeTab === "curl" ? (
        <CurlInput
          curlCommand={curlCommand}
          isFetching={isFetching}
          onCurlChange={onCurlChange}
          onFetchCurl={onFetchCurl}
          requestError={requestError}
          requestMeta={requestMeta}
        />
      ) : (
        <RawJSONInput onRawJSONChange={onRawJSONChange} parseError={parseError} rawJSON={rawJSON} />
      )}
    </Panel>
  );
}

function CurlInput({
  curlCommand,
  isFetching,
  onCurlChange,
  onFetchCurl,
  requestError,
  requestMeta
}) {
  return (
    <div className="mt-4 flex min-h-0 flex-1 flex-col gap-3">
      <textarea
        className="min-h-[340px] flex-1 resize-none overflow-auto rounded-md border border-stone-700 bg-[#0d0e10] p-3 font-mono text-sm leading-6 text-stone-100 outline-none ring-emerald-400/40 focus:ring-2 lg:min-h-0"
        placeholder={`curl "https://api.example.com/users" \\\n  -H "Authorization: Bearer token"`}
        value={curlCommand}
        onChange={(event) => onCurlChange(event.target.value)}
      />
      {requestError ? <InlineMessage tone="error">{requestError}</InlineMessage> : null}
      {requestMeta ? <InlineMessage tone="success">Fetched {requestMeta}</InlineMessage> : null}
      <button
        className="rounded-md bg-emerald-400 px-4 py-2 text-sm font-semibold text-stone-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:bg-stone-600 disabled:text-stone-300"
        type="button"
        disabled={isFetching || !curlCommand.trim()}
        onClick={onFetchCurl}
      >
        {isFetching ? "Fetching..." : "Fetch Request"}
      </button>
    </div>
  );
}

function RawJSONInput({ onRawJSONChange, parseError, rawJSON }) {
  return (
    <div className="mt-4 flex min-h-0 flex-1 flex-col gap-3">
      <textarea
        className="min-h-[420px] flex-1 resize-none overflow-auto rounded-md border border-stone-700 bg-[#0d0e10] p-3 font-mono text-sm leading-6 text-stone-100 outline-none ring-emerald-400/40 focus:ring-2 lg:min-h-0"
        value={rawJSON}
        onChange={(event) => onRawJSONChange(event.target.value)}
        spellCheck={false}
      />
      {parseError ? <InlineMessage tone="error">{parseError}</InlineMessage> : null}
      {!parseError ? (
        <InlineMessage tone="success">JSON5 accepted: trailing commas and unquoted keys are okay.</InlineMessage>
      ) : null}
    </div>
  );
}

function tabClass(active) {
  return [
    "rounded px-3 py-2 text-sm font-medium transition",
    active ? "bg-stone-100 text-stone-950" : "text-stone-400 hover:text-stone-100"
  ].join(" ");
}
