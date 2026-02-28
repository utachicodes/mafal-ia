"use client"

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
      <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        {error.message || "An unexpected error occurred while loading this page."}
      </p>
      <button
        onClick={reset}
        className="px-6 py-2 rounded-xl bg-primary text-white hover:bg-primary/90 transition-colors"
      >
        Try again
      </button>
    </div>
  )
}
