const PANEL_LABELS = {
  input: "Input",
  discovery: "Discovery",
  output: "Output"
};

export function LayoutControls({ onMovePanel, onResetLayout, onResizePanel, order, widths }) {
  return (
    <section className="border-b border-stone-800 bg-[#121316] px-4 py-3 sm:px-6">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-stone-100">Layout</h2>
          <p className="mt-1 text-xs text-stone-400">Resize panels and move them left or right on desktop.</p>
        </div>

        <div className="grid gap-3 lg:grid-cols-3 xl:min-w-[780px]">
          {order.map((panelId, index) => (
            <PanelLayoutControl
              index={index}
              key={panelId}
              onMovePanel={onMovePanel}
              onResizePanel={onResizePanel}
              panelId={panelId}
              total={order.length}
              width={widths[panelId]}
            />
          ))}
        </div>

        <button
          className="w-fit rounded-md border border-stone-700 px-3 py-2 text-sm text-stone-200 transition hover:border-stone-500"
          type="button"
          onClick={onResetLayout}
        >
          Reset
        </button>
      </div>
    </section>
  );
}

function PanelLayoutControl({ index, onMovePanel, onResizePanel, panelId, total, width }) {
  return (
    <div className="rounded-md border border-stone-800 bg-[#0d0e10] p-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium text-stone-100">{PANEL_LABELS[panelId]}</span>
        <div className="flex gap-1">
          <button
            aria-label={`Move ${PANEL_LABELS[panelId]} left`}
            className="h-8 w-8 rounded border border-stone-700 text-stone-200 transition hover:border-stone-500 disabled:cursor-not-allowed disabled:opacity-40"
            disabled={index === 0}
            type="button"
            onClick={() => onMovePanel(panelId, -1)}
          >
            ←
          </button>
          <button
            aria-label={`Move ${PANEL_LABELS[panelId]} right`}
            className="h-8 w-8 rounded border border-stone-700 text-stone-200 transition hover:border-stone-500 disabled:cursor-not-allowed disabled:opacity-40"
            disabled={index === total - 1}
            type="button"
            onClick={() => onMovePanel(panelId, 1)}
          >
            →
          </button>
        </div>
      </div>

      <label className="mt-3 block">
        <span className="flex items-center justify-between text-xs text-stone-400">
          <span>Size</span>
          <span>{width.toFixed(1)}fr</span>
        </span>
        <input
          className="mt-2 w-full accent-emerald-400"
          max="1.8"
          min="0.6"
          step="0.1"
          type="range"
          value={width}
          onChange={(event) => onResizePanel(panelId, Number(event.target.value))}
        />
      </label>
    </div>
  );
}
