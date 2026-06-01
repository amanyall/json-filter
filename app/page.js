"use client";

import JSON5 from "json5";
import { useMemo, useState } from "react";
import { DiscoveryPanel } from "@/components/DiscoveryPanel";
import { Header } from "@/components/Header";
import { InputPanel } from "@/components/InputPanel";
import { LayoutControls } from "@/components/LayoutControls";
import { OutputPanel } from "@/components/OutputPanel";
import { starterPayload } from "@/lib/sample-payload";
import { filterJSONByPaths, flattenJSON } from "@/lib/json-paths";
import { createMatchedPathSet } from "@/lib/search";

const defaultPanelOrder = ["input", "discovery", "output"];
const defaultPanelWidths = {
  input: 0.95,
  discovery: 1.05,
  output: 1
};

export default function Home() {
  const [activeTab, setActiveTab] = useState("json");
  const [rawJSON, setRawJSON] = useState(starterPayload);
  const [curlCommand, setCurlCommand] = useState("");
  const [payload, setPayload] = useState(() => JSON5.parse(starterPayload));
  const [selectedPaths, setSelectedPaths] = useState(new Set(["user.email"]));
  const [search, setSearch] = useState("");
  const [parseError, setParseError] = useState("");
  const [requestError, setRequestError] = useState("");
  const [requestMeta, setRequestMeta] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [copyState, setCopyState] = useState("Copy");
  const [panelOrder, setPanelOrder] = useState(defaultPanelOrder);
  const [panelWidths, setPanelWidths] = useState(defaultPanelWidths);

  const flattenedPaths = useMemo(() => flattenJSON(payload), [payload]);
  const matchedPaths = useMemo(
    () => createMatchedPathSet(flattenedPaths, search),
    [flattenedPaths, search]
  );

  const visiblePaths = useMemo(() => {
    if (!search.trim()) {
      return flattenedPaths;
    }
    return flattenedPaths.filter((path) => matchedPaths.has(path));
  }, [flattenedPaths, matchedPaths, search]);

  const effectivePaths = useMemo(
    () => Array.from(new Set([...selectedPaths, ...matchedPaths])),
    [matchedPaths, selectedPaths]
  );

  const filteredPayload = useMemo(
    () => filterJSONByPaths(payload, effectivePaths),
    [effectivePaths, payload]
  );

  const outputJSON = useMemo(() => JSON.stringify(filteredPayload, null, 2), [filteredPayload]);

  function parseRawInput(nextValue) {
    setRawJSON(nextValue);
    setRequestError("");
    setRequestMeta("");

    try {
      const parsed = JSON5.parse(nextValue);
      setPayload(parsed);
      setParseError("");
      setSelectedPaths(new Set());
    } catch (error) {
      setParseError(error instanceof Error ? error.message : "Unable to parse JSON input.");
    }
  }

  function togglePath(path) {
    setSelectedPaths((current) => {
      const next = new Set(current);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  }

  function selectVisiblePaths() {
    setSelectedPaths((current) => new Set([...current, ...visiblePaths]));
  }

  function clearSelectedPaths() {
    setSelectedPaths(new Set());
  }

  function clearSearch() {
    setSearch("");
  }

  async function fetchCurl() {
    setIsFetching(true);
    setRequestError("");
    setRequestMeta("");
    setParseError("");

    try {
      const response = await fetch("/api/proxy-curl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ curl: curlCommand })
      });
      const result = await response.json();

      if (!response.ok || result.error) {
        throw new Error(result.error ?? "The request failed.");
      }

      setPayload(result.payload);
      setRawJSON(JSON.stringify(result.payload, null, 2));
      setSelectedPaths(new Set());
      setRequestMeta(`${result.status} ${result.statusText}${result.ok ? "" : " (non-2xx)"}`);
    } catch (error) {
      setRequestError(error instanceof Error ? error.message : "Unable to fetch cURL request.");
    } finally {
      setIsFetching(false);
    }
  }

  async function copyOutput() {
    await navigator.clipboard.writeText(outputJSON);
    setCopyState("Copied");
    window.setTimeout(() => setCopyState("Copy"), 1200);
  }

  function movePanel(panelId, direction) {
    setPanelOrder((current) => {
      const index = current.indexOf(panelId);
      const nextIndex = index + direction;

      if (index === -1 || nextIndex < 0 || nextIndex >= current.length) {
        return current;
      }

      const next = [...current];
      const [panel] = next.splice(index, 1);
      next.splice(nextIndex, 0, panel);
      return next;
    });
  }

  function resizePanel(panelId, width) {
    setPanelWidths((current) => ({
      ...current,
      [panelId]: width
    }));
  }

  function resetLayout() {
    setPanelOrder(defaultPanelOrder);
    setPanelWidths(defaultPanelWidths);
  }

  const panelColumns = panelOrder.map((panelId) => `${panelWidths[panelId]}fr`).join(" ");

  return (
    <main className="flex min-h-screen flex-col bg-[#101113] text-stone-100 lg:h-screen lg:overflow-hidden">
      <Header discoveredCount={flattenedPaths.length} activeCount={effectivePaths.length} />

      <section
        className="grid min-h-[calc(100vh-238px)] grid-cols-1 divide-y divide-stone-800 lg:min-h-0 lg:flex-1 lg:[grid-template-columns:var(--panel-columns)] lg:divide-x lg:divide-y-0 lg:overflow-hidden"
        style={{ "--panel-columns": panelColumns }}
      >
        <InputPanel
          activeTab={activeTab}
          curlCommand={curlCommand}
          isFetching={isFetching}
          onCurlChange={setCurlCommand}
          onFetchCurl={fetchCurl}
          onRawJSONChange={parseRawInput}
          onTabChange={setActiveTab}
          parseError={parseError}
          rawJSON={rawJSON}
          requestError={requestError}
          requestMeta={requestMeta}
          style={{ order: panelOrder.indexOf("input") }}
        />

        <DiscoveryPanel
          activeSearch={search}
          matchedPaths={matchedPaths}
          onClearSearch={clearSearch}
          onClearSelected={clearSelectedPaths}
          onSearchSubmit={setSearch}
          onSelectVisible={selectVisiblePaths}
          onTogglePath={togglePath}
          selectedPaths={selectedPaths}
          style={{ order: panelOrder.indexOf("discovery") }}
          visiblePaths={visiblePaths}
        />

        <OutputPanel
          copyState={copyState}
          onCopy={copyOutput}
          outputJSON={outputJSON}
          payload={filteredPayload}
          style={{ order: panelOrder.indexOf("output") }}
        />
      </section>
    </main>
  );
}
