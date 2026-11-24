import Link from "next/link";
import {
  Headphones,
  Laptop,
  Refrigerator,
  Smartphone,
  Snowflake,
  Tv,
  WashingMachine,
  Zap,
} from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";

const CATEGORY_ITEMS = [
  { name: "Smartphone", icon: Smartphone, note: "Screen, battery, charging port" },
  { name: "Laptop & PC", icon: Laptop, note: "Servicing, upgrades, repairs" },
  { name: "AC", icon: Snowflake, note: "Servicing, gas refill, install" },
  { name: "Refrigerator", icon: Refrigerator, note: "Cooling, compressor, repair" },
  { name: "TV", icon: Tv, note: "Panel, board and backlight fixes" },
  { name: "Washing Machine", icon: WashingMachine, note: "Motor, drain and drum repair" },
  { name: "Electrical", icon: Zap, note: "Wiring, switches and fittings" },
  { name: "Earbuds & Audio", icon: Headphones, note: "TWS, Bluetooth earphones, speakers" },
];

export default function Categories() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Popular Categories"
          title="Whatever is broken, we have a fixer"
          subtitle="Pick a category to see matching services right away."
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORY_ITEMS.map(({ name, icon: Icon, note }) => (
            <Link
              key={name}
              href={`/services?category=${encodeURIComponent(name)}`}
              className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-md"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                <Icon size={24} />
              </span>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">{name}</h3>
              <p className="mt-1 text-sm text-slate-600">{note}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}