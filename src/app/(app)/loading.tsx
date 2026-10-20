export default function Loading() {
  return (
    <div role="status" aria-label="Loading next screen" className="space-y-7">
      <span className="sr-only">Loading next screen...</span>
      <div aria-hidden="true" className="animate-pulse space-y-7">
        <div className="space-y-3">
          <div className="h-3 w-28 rounded bg-muted" />
          <div className="h-10 w-64 max-w-full rounded bg-muted" />
          <div className="h-4 max-w-xl rounded bg-muted" />
          <div className="h-4 w-3/4 max-w-md rounded bg-muted" />
        </div>
        <div className="grid gap-6 xl:grid-cols-2">
          <div className="min-h-64 rounded-2xl border border-border bg-card p-6">
            <div className="h-5 w-2/5 rounded bg-muted" />
            <div className="mt-5 h-32 rounded-xl bg-muted" />
            <div className="mt-5 h-10 w-36 rounded-lg bg-muted" />
          </div>
          <div className="space-y-6">
            <div className="min-h-40 rounded-2xl border border-border bg-card p-6">
              <div className="h-5 w-1/2 rounded bg-muted" />
              <div className="mt-4 h-4 rounded bg-muted" />
              <div className="mt-2 h-4 w-3/4 rounded bg-muted" />
              <div className="mt-5 h-8 w-28 rounded-lg bg-muted" />
            </div>
            <div className="min-h-28 rounded-2xl border border-border bg-card p-6">
              <div className="h-5 w-2/5 rounded bg-muted" />
              <div className="mt-4 h-4 rounded bg-muted" />
              <div className="mt-2 h-4 w-3/5 rounded bg-muted" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
