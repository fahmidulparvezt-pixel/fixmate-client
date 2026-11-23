import { Suspense } from "react";
import Hero from "@/components/home/Hero";
import FeaturedServices, { FeaturedSkeleton } from "@/components/home/FeaturedServices";
import HowItWorks from "@/components/home/HowItWorks";
import Categories from "@/components/home/Categories";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import SectionHeading from "@/components/ui/SectionHeading";
export default function HomePage() {
  return (
    <>
      <Hero />

      <Suspense
        fallback={
          <section className="py-16 sm:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <SectionHeading
                eyebrow="Featured Services"
                title="Latest repair services"
                subtitle="Loading the newest services..."
              />
              <div className="mt-12">
                <FeaturedSkeleton />
              </div>
            </div>
          </section>
        }
      >
        <FeaturedServices />
      </Suspense>

      <HowItWorks />
      <Categories />
      <WhyChooseUs />
    </>
  );
}
