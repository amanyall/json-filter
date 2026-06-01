"use client";

import { useState } from "react";

export function JSONTreeView({ value }) {
  return (
    <div className="min-w-max">
      <TreeNode name="root" path="root" value={value} depth={0} initiallyOpen />
    </div>
  );
}

function TreeNode({ depth, initiallyOpen = false, name, path, value }) {
  const [open, setOpen] = useState(initiallyOpen || depth < 2);
  const container = getContainerInfo(value);
  const paddingLeft = `${depth * 18}px`;

  if (!container) {
    return (
      <div className="flex gap-2 whitespace-nowrap" style={{ paddingLeft }}>
        <span className="text-emerald-300">{name}</span>
        <span className="text-stone-500">:</span>
        <PrimitiveValue value={value} />
      </div>
    );
  }

  return (
    <div>
      <button
        className="flex w-full items-center gap-2 whitespace-nowrap text-left hover:bg-stone-900"
        style={{ paddingLeft }}
        type="button"
        onClick={() => setOpen((current) => !current)}
      >
        <span className="inline-block w-4 text-stone-400">{open ? "▾" : "▸"}</span>
        <span className="text-emerald-300">{name}</span>
        <span className="text-stone-500">:</span>
        <span className="text-sky-200">{container.label}</span>
        <span className="text-stone-500">{container.count}</span>
      </button>

      {open
        ? container.entries.map(([childName, childValue]) => (
            <TreeNode
              depth={depth + 1}
              key={`${path}.${childName}`}
              name={childName}
              path={`${path}.${childName}`}
              value={childValue}
            />
          ))
        : null}
    </div>
  );
}

function PrimitiveValue({ value }) {
  if (value === null) {
    return <span className="text-stone-500">null</span>;
  }

  if (typeof value === "string") {
    return <span className="text-amber-200">{JSON.stringify(value)}</span>;
  }

  if (typeof value === "number") {
    return <span className="text-fuchsia-200">{value}</span>;
  }

  if (typeof value === "boolean") {
    return <span className="text-sky-300">{String(value)}</span>;
  }

  return <span className="text-stone-300">{String(value)}</span>;
}

function getContainerInfo(value) {
  if (Array.isArray(value)) {
    return {
      count: `${value.length} item${value.length === 1 ? "" : "s"}`,
      entries: value.map((item, index) => [`[${index}]`, item]),
      label: "Array"
    };
  }

  if (value && typeof value === "object") {
    const entries = Object.entries(value);
    return {
      count: `${entries.length} key${entries.length === 1 ? "" : "s"}`,
      entries,
      label: "Object"
    };
  }

  return null;
}
