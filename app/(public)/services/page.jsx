import { Suspense } from "react";
import ServiceFilters from "@/components/services/ServiceFilters";
import ServicesResults from "@/components/services/ServicesResults";
import ServiceGridSkeleton from "@/components/services/ServiceGridSkeleton";
import SectionHeading from "@/components/ui/SectionHeading";
export const metadata = {
  title: "Browse Services | FixMate",
};
export default function ServicesPage({ searchParams }) {
  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Services"
          title="Find the right repair service"
          subtitle="Search, filter and sort approved services from verified technicians."
        />

        <div className="mt-10">
          <Suspense
            fallback={
              <div className="h-40 animate-pulse rounded-2xl border border-slate-200 bg-white" />
            }
          >
            <ServiceFilters />
          </Suspense>
        </div>

        <div className="mt-8">
          <Suspense fallback={<ServiceGridSkeleton />}>
            <ServicesResults searchParams={searchParams} />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
