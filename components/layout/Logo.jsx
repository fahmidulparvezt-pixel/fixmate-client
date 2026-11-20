import Link from "next/link";
import { Wrench } from "lucide-react";

export default function Logo({ className = "" }) {
  return (
    <Link href="/" className={`inline-flex items-center gap-2 ${className}`}>
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
        <Wrench size={20} />
      </span>
      <span className="text-xl font-bold tracking-tight text-slate-900">
        Fix<span className="text-blue-600">Mate</span>
      </span>
    </Link>
  );
}