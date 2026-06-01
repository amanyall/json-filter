"use client";

export default function Error({ error, reset }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#101113] px-6 text-stone-100">
      <section className="max-w-xl rounded-md border border-red-400/30 bg-red-500/10 p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-200">Runtime error</p>
        <h1 className="mt-2 text-2xl font-semibold">The JSON hub hit an error.</h1>
        <p className="mt-3 break-words text-sm text-red-100">
          {error?.message ?? "Something went wrong while rendering the app."}
        </p>
        <button
          className="mt-5 rounded-md bg-red-200 px-4 py-2 text-sm font-semibold text-red-950 transition hover:bg-red-100"
          type="button"
          onClick={reset}
        >
          Try again
        </button>
      </section>
    </main>
  );
}
