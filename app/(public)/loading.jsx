import { Wrench } from "lucide-react";
export default function Loading() {
  return (
    <div
      role="status"
      aria-label="Loading"
      className="flex min-h-[60vh] flex-col items-center justify-center gap-4"
    >
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600">
        <Wrench size={28} className="animate-spin" />
      </span>
      <p className="text-sm font-medium text-slate-500">Loading...</p>
    </div>
  );
}
