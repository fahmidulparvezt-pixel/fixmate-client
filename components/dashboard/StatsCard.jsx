const TONES = {
  blue: "bg-blue-100 text-blue-600",
  green: "bg-green-100 text-green-600",
  amber: "bg-amber-100 text-amber-600",
  purple: "bg-purple-100 text-purple-600",
  red: "bg-red-100 text-red-600",
};
export default function StatsCard({
  icon: Icon,
  label,
  value,
  tone = "blue",
  hint,
  loading = false,
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <span
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${TONES[tone] || TONES.blue}`}
      >
        {Icon && <Icon size={24} />}
      </span>
      <div className="min-w-0">
        <p className="text-sm text-slate-500">{label}</p>
        {loading ? (
          <div className="mt-1 h-7 w-16 animate-pulse rounded bg-slate-200" />
        ) : (
          <p className="text-2xl font-bold text-slate-900">{value ?? "-"}</p>
        )}
        {hint && <p className="mt-0.5 truncate text-xs text-slate-400">{hint}</p>}
      </div>
    </div>
  );
}
