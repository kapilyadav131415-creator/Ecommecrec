"use client"

import { useEffect } from "react"

export default function Error({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  useEffect(() => {
    // Log error to monitoring service (optional)
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md text-center bg-white p-8 rounded-lg shadow">
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
          Something went wrong
        </h1>

        <p className="text-sm text-gray-600 mb-6">
          We ran into an unexpected problem. Please try again or come back later.
        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => reset()}
            className="rounded-md bg-black px-5 py-2 text-sm font-medium text-white hover:bg-gray-800 transition"
          >
            Try Again
          </button>

          <a
            href="/"
            className="rounded-md border px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
          >
            Go Home
          </a>
        </div>
      </div>
    </div>
  )
}
