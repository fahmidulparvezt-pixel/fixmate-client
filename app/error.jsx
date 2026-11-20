"use client";

import Link from "next/link";

export default function Error({ error, reset }) {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-3xl font-bold text-slate-900">Something went wrong</h1>
      <p className="mt-3 max-w-md text-slate-600">
        {error?.message || "An unexpected error occurred. Please try again."}
      </p>
      <div className="mt-6 flex gap-3">
        <button
          onClick={() => reset()}
          className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="rounded-lg border border-slate-300 px-5 py-2.5 font-medium text-slate-700 hover:bg-slate-50"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}