"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <span className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-red-600">
        <AlertTriangle size={40} />
      </span>
      <h1 className="mt-6 text-3xl font-bold tracking-tight text-slate-900">Something went wrong</h1>
      <p className="mt-3 max-w-md text-slate-600">
        An unexpected error happened while loading this page. Please try again, or go back to the
        home page.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button
          onClick={() => reset()}
          className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          <RotateCcw size={18} /> Try Again
        </button>
        <Link
          href="/"
          className="flex items-center justify-center gap-2 rounded-lg border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          <Home size={18} /> Back to Home
        </Link>
      </div>
    </main>
  );
}