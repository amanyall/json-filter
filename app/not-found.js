export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#101113] px-6 text-stone-100">
      <section className="max-w-xl rounded-md border border-stone-700 bg-[#151619] p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-300">404</p>
        <h1 className="mt-2 text-2xl font-semibold">Page not found</h1>
        <p className="mt-3 text-sm text-stone-400">The JSON-Filter dashboard is available at the root route.</p>
      </section>
    </main>
  );
}
