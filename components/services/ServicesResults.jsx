import Link from "next/link";
import { SearchX } from "lucide-react";
import ServiceCard from "@/components/services/ServiceCard";
import { publicFetch } from "@/lib/api";
const first = (value) => (Array.isArray(value) ? value[0] : value);
export default async function ServicesResults({ searchParams }) {
  const params = await searchParams;
  const qs = new URLSearchParams();
  ["search", "category", "serviceMode", "sort"].forEach((key) => {
    const value = first(params?.[key]);
    if (value) qs.set(key, value);
  });
  let services = [];
  let failed = false;
  try {
    services = await publicFetch(`/api/services${qs.toString() ? `?${qs}` : ""}`);
  } catch {
    failed = true;
  }
  if (failed) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-red-700">
        Could not load services right now. Please refresh the page in a moment.
      </div>
    );
  }
  if (services.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
        <SearchX size={40} className="mx-auto text-slate-400" />
        <h3 className="mt-4 text-lg font-semibold text-slate-900">No services found</h3>
        <p className="mt-1 text-slate-600">
          Try a different keyword or clear the filters to see all services.
        </p>
        <Link
          href="/services"
          className="mt-5 inline-block rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700"
        >
          Clear Filters
        </Link>
      </div>
    );
  }
  return (
    <>
      <p className="mb-5 text-sm text-slate-600">
        Showing <span className="font-semibold text-slate-900">{services.length}</span>{" "}
        {services.length === 1 ? "service" : "services"}
      </p>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {services.map((service) => (
          <ServiceCard key={service._id} service={service} />
        ))}
      </div>
    </>
  );
}
