export function Panel({ children, style, subtitle, title }) {
  return (
    <section
      className="flex min-h-[680px] flex-col overflow-hidden bg-[#151619] p-4 sm:p-5 lg:h-full lg:min-h-0"
      style={style}
    >
      <div className="mb-4 shrink-0">
        <h2 className="text-base font-semibold text-stone-50">{title}</h2>
        <p className="mt-1 text-sm text-stone-400">{subtitle}</p>
      </div>
      {children}
    </section>
  );
}
