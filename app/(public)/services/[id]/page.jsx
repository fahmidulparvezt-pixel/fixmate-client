import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, MapPin, UserRound, Wrench } from "lucide-react";
import { publicFetch } from "@/lib/api";
import RequestRepair from "@/components/services/RequestRepair";
export const metadata = {
  title: "Service Details | FixMate",
};
function DetailsSkeleton() {
  return (
    <div className="grid gap-10 lg:grid-cols-3">
      <div className="space-y-5 lg:col-span-2">
        <div className="h-80 animate-pulse rounded-2xl bg-slate-200" />
        <div className="h-8 w-2/3 animate-pulse rounded bg-slate-200" />
        <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
        <div className="h-4 w-5/6 animate-pulse rounded bg-slate-200" />
      </div>
      <div className="h-96 animate-pulse rounded-2xl bg-slate-200" />
    </div>
  );
}
function InfoRow({ icon: Icon, label, value }) {
  return (
    <li className="flex items-start gap-3">
      <Icon size={18} className="mt-0.5 shrink-0 text-slate-400" />
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="text-sm font-medium text-slate-900">{value}</p>
      </div>
    </li>
  );
}
async function ServiceDetails({ params }) {
  const { id } = await params;
  let service = null;
  try {
    service = await publicFetch(`/api/services/${id}`);
  } catch {
    notFound();
  }
  if (!service?._id) notFound();
  const tech = service.technician || {};
  const techName = tech.name || service.technicianName;
  return (
    <div className="grid gap-10 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <img
          src={service.image}
          alt={service.title}
          className="h-72 w-full rounded-2xl border border-slate-200 object-cover sm:h-96"
        />

        <span className="mt-6 inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
          {service.category}
        </span>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          {service.title}
        </h1>

        <h2 className="mt-8 text-lg font-semibold text-slate-900">About this service</h2>
        <p className="mt-2 whitespace-pre-line leading-relaxed text-slate-600">
          {service.description}
        </p>
      </div>

      <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Starting from</p>
          <p className="text-4xl font-extrabold text-slate-900">${service.basePrice}</p>

          <ul className="mt-6 space-y-4">
            <InfoRow icon={Clock} label="Estimated duration" value={service.estimatedDuration} />
            <InfoRow icon={Wrench} label="Service mode" value={service.serviceMode} />
            <InfoRow icon={MapPin} label="Service area" value={service.serviceArea} />
          </ul>

          <div className="mt-6">
            <RequestRepair
              service={{
                _id: service._id,
                title: service.title,
                basePrice: service.basePrice,
                technicianEmail: service.technicianEmail,
              }}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Technician
          </h2>
          <div className="mt-4 flex items-center gap-4">
            {tech.image ? (
              <img
                src={tech.image}
                alt={techName}
                referrerPolicy="no-referrer"
                className="h-14 w-14 rounded-full border border-slate-200 object-cover"
              />
            ) : (
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-xl font-semibold text-white">
                {(techName || "T").charAt(0).toUpperCase()}
              </span>
            )}
            <div className="min-w-0">
              <p className="truncate font-semibold text-slate-900">{techName}</p>
              {tech.area && (
                <p className="flex items-center gap-1 text-sm text-slate-500">
                  <UserRound size={14} /> {tech.area}
                </p>
              )}
            </div>
          </div>
          {tech.bio && <p className="mt-4 text-sm leading-relaxed text-slate-600">{tech.bio}</p>}
        </div>
      </aside>
    </div>
  );
}
export default function ServiceDetailsPage({ params }) {
  return (
    <section className="py-10 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/services"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600"
        >
          <ArrowLeft size={16} /> Back to services
        </Link>

        <Suspense fallback={<DetailsSkeleton />}>
          <ServiceDetails params={params} />
        </Suspense>
      </div>
    </section>
  );
}
