import { CheckCircle2, Search, ShieldCheck, Wallet } from "lucide-react";

function HeroIllustration() {
  return (
    <svg
      viewBox="0 0 520 440"
      role="img"
      aria-label="A smartphone being repaired with a wrench and screwdriver"
      className="mx-auto h-auto w-full max-w-lg"
    >
      <defs>
        <linearGradient id="heroScreen" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2563eb" />
          <stop offset="1" stopColor="#7c3aed" />
        </linearGradient>
        <linearGradient id="heroBlob" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#dbeafe" />
          <stop offset="1" stopColor="#e0e7ff" />
        </linearGradient>
        <filter id="heroShadow" x="-20%" y="-20%" width="140%" height="160%">
          <feDropShadow dx="0" dy="10" stdDeviation="10" floodColor="#1e3a8a" floodOpacity="0.2" />
        </filter>
      </defs>

      <ellipse cx="260" cy="225" rx="235" ry="200" fill="url(#heroBlob)" />
      <circle cx="70" cy="70" r="6" fill="#93c5fd" />
      <circle cx="470" cy="60" r="9" fill="#c4b5fd" />
      <circle cx="480" cy="390" r="7" fill="#93c5fd" />
      <circle cx="40" cy="300" r="5" fill="#c4b5fd" />

      <g transform="translate(110 110)">
        <circle r="30" fill="none" stroke="#3b82f6" strokeWidth="11" strokeDasharray="10.5 10.5" />
        <circle r="24" fill="#3b82f6" />
        <circle r="9" fill="#eff6ff" />
      </g>
      <g transform="translate(462 215)">
        <circle r="19" fill="none" stroke="#8b5cf6" strokeWidth="8" strokeDasharray="7 7" />
        <circle r="15" fill="#8b5cf6" />
        <circle r="6" fill="#eff6ff" />
      </g>

      <g filter="url(#heroShadow)">
        <rect x="190" y="62" width="140" height="300" rx="28" fill="#1e293b" />
        <rect x="200" y="76" width="120" height="272" rx="20" fill="url(#heroScreen)" />
        <rect x="240" y="82" width="40" height="8" rx="4" fill="#0f172a" />

        <g fill="none" stroke="#ffffff" strokeOpacity="0.85" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="200,140 236,172 222,206 268,238 252,276" />
          <polyline points="236,172 262,160 292,176" />
          <polyline points="268,238 300,230" />
        </g>

        <g transform="translate(260 120)">
          <circle r="22" fill="#ffffff" fillOpacity="0.18" />
          <path
            d="M-9 4 L3 -8 M-3 -10 A8 8 0 0 1 9 -2 L12 1 L5 8 L2 5 A8 8 0 0 1 -9 4"
            fill="none"
            stroke="#ffffff"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>

        <text x="260" y="308" textAnchor="middle" fontSize="12" fontWeight="700" fill="#ffffff" fontFamily="Arial, sans-serif">
          Repairing...
        </text>
        <rect x="216" y="318" width="88" height="8" rx="4" fill="#ffffff" fillOpacity="0.3" />
        <rect x="216" y="318" width="56" height="8" rx="4" fill="#4ade80" />
      </g>

      <g transform="translate(405 330) rotate(-35)" filter="url(#heroShadow)">
        <rect x="-9" y="-6" width="18" height="120" rx="9" fill="#f59e0b" />
        <circle cx="0" cy="-14" r="26" fill="#f59e0b" />
        <rect x="-10" y="-50" width="20" height="26" fill="#dbeafe" />
        <circle cx="0" cy="104" r="5" fill="#fef3c7" />
      </g>

      <g transform="translate(88 335) rotate(38)" filter="url(#heroShadow)">
        <rect x="-11" y="0" width="22" height="64" rx="10" fill="#ef4444" />
        <rect x="-11" y="22" width="22" height="8" fill="#b91c1c" />
        <rect x="-4" y="-62" width="8" height="64" rx="3" fill="#94a3b8" />
        <polygon points="-4,-62 4,-62 2,-74 -2,-74" fill="#64748b" />
      </g>

      <g filter="url(#heroShadow)">
        <rect x="345" y="92" width="150" height="54" rx="16" fill="#ffffff" />
        <circle cx="372" cy="119" r="14" fill="#dcfce7" />
        <path d="M365 119 l5 5 l9 -10" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <text x="394" y="115" fontSize="12" fontWeight="700" fill="#0f172a" fontFamily="Arial, sans-serif">Verified</text>
        <text x="394" y="130" fontSize="11" fill="#64748b" fontFamily="Arial, sans-serif">Technician</text>
      </g>

      <g filter="url(#heroShadow)">
        <rect x="26" y="228" width="160" height="54" rx="16" fill="#ffffff" />
        <circle cx="54" cy="255" r="14" fill="#ffedd5" />
        <rect x="46" y="249" width="16" height="12" rx="2.5" fill="none" stroke="#ea580c" strokeWidth="2.5" />
        <line x1="46" y1="254" x2="62" y2="254" stroke="#ea580c" strokeWidth="2.5" />
        <text x="76" y="251" fontSize="12" fontWeight="700" fill="#0f172a" fontFamily="Arial, sans-serif">Pay after</text>
        <text x="76" y="266" fontSize="11" fill="#64748b" fontFamily="Arial, sans-serif">completion</text>
      </g>
    </svg>
  );
}

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
            Book repairs for phones, laptops, AC, fridge, TV and more. Track every step of the
            job and pay online only after the work is done.
          </p>

          <form action="/services" method="get" className="mt-8 flex max-w-xl flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                name="search"
                placeholder="Try &quot;iPhone screen&quot; or &quot;AC service&quot;"
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

        <div className="relative">
          <HeroIllustration />
        </div>
      </div>
    </section>
  );
}