import Link from "next/link";
import { MapPin, UserRound, Wrench } from "lucide-react";
export default function ServiceCard({ service }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="relative h-48 w-full shrink-0 bg-slate-100">
        <img
          src={service.image}
          alt={service.title}
          loading="lazy"
          className="h-full w-full object-cover"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-blue-700 shadow-sm">
          {service.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-2 min-h-[3.5rem] text-lg font-semibold leading-snug text-slate-900">
          {service.title}
        </h3>

        <ul className="mt-3 space-y-2 text-sm text-slate-600">
          <li className="flex items-center gap-2">
            <Wrench size={15} className="shrink-0 text-slate-400" />
            <span className="truncate">{service.serviceMode}</span>
          </li>
          <li className="flex items-center gap-2">
            <MapPin size={15} className="shrink-0 text-slate-400" />
            <span className="truncate">{service.serviceArea}</span>
          </li>
          <li className="flex items-center gap-2">
            <UserRound size={15} className="shrink-0 text-slate-400" />
            <span className="truncate">{service.technicianName}</span>
          </li>
        </ul>

        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <div>
            <p className="text-xs text-slate-500">Starting from</p>
            <p className="text-xl font-bold text-slate-900">${service.basePrice}</p>
          </div>
          <Link
            href={`/services/${service._id}`}
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}
