import { CheckCircle2, Search, ShieldCheck, Wallet } from "lucide-react";
const TRACKER_STEPS = [
  {
    label: "Requested",
    state: "done",
  },
  {
    label: "Accepted",
    state: "done",
  },
  {
    label: "In Progress",
    state: "active",
  },
  {
    label: "Completed",
    state: "todo",
  },
];
export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 via-white to-white">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-1.5 text-sm font-semibold text-blue-700">
            <ShieldCheck size={16} /> Verified technicians only
          </span>

          <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl">
            Broken Device? Get It Fixed by{" "}
            <span className="text-blue-600">Verified Technicians</span>
          </h1>

          <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600">
            Book repairs for phones, laptops, AC, fridge, TV and more. Track every step of the job
            and pay online only after the work is done.
          </p>

          <form
            action="/services"
            method="get"
            className="mt-8 flex max-w-xl flex-col gap-3 sm:flex-row"
          >
            <div className="relative flex-1">
              <Search
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                name="search"
                placeholder='Try "iPhone screen" or "AC service"'
                aria-label="Search repair services"
                className="w-full rounded-lg border border-slate-300 bg-white py-3 pl-11 pr-4 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Find a Technician
            </button>
          </form>

          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-600">
            <li className="flex items-center gap-2">
              <CheckCircle2 size={18} className="text-green-600" /> Step-by-step job tracking
            </li>
            <li className="flex items-center gap-2">
              <Wallet size={18} className="text-green-600" /> Pay only after completion
            </li>
          </ul>
        </div>

        <div className="relative mx-auto w-full max-w-md">
          <div className="absolute -left-6 -top-6 h-40 w-40 rounded-full bg-blue-200/50 blur-2xl" />
          <div className="absolute -bottom-6 -right-6 h-40 w-40 rounded-full bg-amber-200/50 blur-2xl" />

          <div className="relative rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Repair job #1024
                </p>
                <h3 className="mt-1 text-lg font-bold text-slate-900">iPhone Screen Replacement</h3>
                <p className="text-sm text-slate-500">Technician: Rahim Uddin</p>
              </div>
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                In Progress
              </span>
            </div>

            <ol className="mt-6 space-y-4">
              {TRACKER_STEPS.map(({ label, state }) => (
                <li key={label} className="flex items-center gap-3">
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${state === "done" ? "bg-green-500 text-white" : state === "active" ? "bg-amber-500 text-white ring-4 ring-amber-100" : "bg-slate-200 text-slate-500"}`}
                  >
                    {state === "done" ? "✓" : ""}
                  </span>
                  <span
                    className={`text-sm font-medium ${state === "todo" ? "text-slate-400" : "text-slate-800"}`}
                  >
                    {label}
                  </span>
                </li>
              ))}
            </ol>

            <div className="mt-6 flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
              <span className="text-sm text-slate-600">Payment</span>
              <span className="text-sm font-semibold text-orange-600">After completion</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
