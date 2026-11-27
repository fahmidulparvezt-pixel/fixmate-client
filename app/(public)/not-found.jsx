import Link from "next/link";
import { Hammer, Home, Settings, Wrench } from "lucide-react";

export const metadata = { title: "Page Not Found | FixMate" };

export default function PublicNotFound() {
  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="relative flex h-44 w-44 items-center justify-center">
        <span className="absolute inset-0 rounded-full bg-blue-100/70" />
        <Settings size={120} strokeWidth={1.25} className="absolute text-blue-200" />
        <Wrench size={64} className="absolute -left-2 top-4 -rotate-45 text-blue-600" />
        <Hammer size={64} className="absolute -right-2 bottom-4 rotate-12 text-amber-500" />
      </div>

      <p className="mt-8 text-sm font-semibold uppercase tracking-wider text-blue-600">Error 404</p>
      <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
        This page needs repairing
      </h1>
      <p className="mt-4 max-w-md text-base leading-relaxed text-slate-600">
        The page you are looking for does not exist or has been moved. Let our technicians point you
        back to the right place.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/"
          className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          <Home size={18} /> Back to Home
        </Link>
        <Link
          href="/services"
          className="rounded-lg border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Browse Services
        </Link>
      </div>
    </section>
  );
}