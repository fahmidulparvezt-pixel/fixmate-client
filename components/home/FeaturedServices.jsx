import Link from "next/link";
import { SearchX } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import ServiceCard from "@/components/services/ServiceCard";
import { publicFetch } from "@/lib/api";
export function FeaturedSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({
        length: 6,
      }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="h-48 animate-pulse bg-slate-200" />
          <div className="space-y-3 p-5">
            <div className="h-5 w-3/4 animate-pulse rounded bg-slate-200" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-slate-200" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200" />
            <div className="h-10 w-full animate-pulse rounded bg-slate-200" />
          </div>
        </div>
      ))}
    </div>
  );
}
export default async function FeaturedServices() {
  let services = [];
  let failed = false;
  try {
    services = await publicFetch("/api/services?limit=6");
  } catch {
    failed = true;
  }
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Featured Services"
          title="Latest repair services"
          subtitle="Freshly listed services from approved technicians, ready to book today."
        />

        <div className="mt-12">
          {failed ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-red-700">
              Could not load services right now. Please refresh the page in a moment.
            </div>
          ) : services.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
              <SearchX size={40} className="mx-auto text-slate-400" />
              <h3 className="mt-4 text-lg font-semibold text-slate-900">No services yet</h3>
              <p className="mt-1 text-slate-600">
                New services will appear here once technicians add them.
              </p>
              <Link
                href="/services"
                className="mt-5 inline-block rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700"
              >
                Browse Services
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <ServiceCard key={service._id} service={service} />
              ))}
            </div>
          )}
        </div>

        {services.length > 0 && (
          <div className="mt-10 text-center">
            <Link
              href="/services"
              className="inline-block rounded-lg border border-blue-600 px-6 py-2.5 font-semibold text-blue-600 transition hover:bg-blue-50"
            >
              View All Services
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
