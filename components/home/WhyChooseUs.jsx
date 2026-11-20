import { BadgeCheck, Clock, Star, Wallet } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";

const STATS = [
  { value: "500+", label: "Verified technicians" },
  { value: "12,000+", label: "Jobs completed" },
  { value: "4.8/5", label: "Average rating" },
  { value: "100%", label: "Pay after service" },
];

const POINTS = [
  {
    icon: BadgeCheck,
    title: "Verified technicians",
    text: "Every service is reviewed and approved by our admins before it goes live.",
  },
  {
    icon: Clock,
    title: "Track every job",
    text: "See each stage of your repair, from requested to completed, in real time.",
  },
  {
    icon: Wallet,
    title: "Pay after the work",
    text: "You pay online only once the technician marks the job completed.",
  },
];

const TESTIMONIALS = [
  {
    name: "Nusrat Jahan",
    area: "Mirpur, Dhaka",
    text: "My laptop was fixed in a day and I could see every update. Paying only after the repair felt very safe.",
  },
  {
    name: "Tanvir Ahmed",
    area: "Dhanmondi, Dhaka",
    text: "The AC technician arrived on the booked date and set a fair final price. Smooth from start to finish.",
  },
  {
    name: "Sabrina Karim",
    area: "Uttara, Dhaka",
    text: "As a technician, FixMate gives me a proper place to list services and manage incoming jobs.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-slate-900 py-16 text-white sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-400">
            Why Choose Us
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Repairs you can trust
          </h2>
          <p className="mt-3 text-base leading-relaxed text-slate-300">
            FixMate fixes the two biggest repair worries: not knowing what is happening and paying
            before the work is done.
          </p>
        </div>

        <dl className="mt-12 grid grid-cols-2 gap-5 lg:grid-cols-4">
          {STATS.map(({ value, label }) => (
            <div key={label} className="rounded-2xl bg-slate-800 p-6 text-center">
              <dt className="text-3xl font-extrabold text-blue-400">{value}</dt>
              <dd className="mt-1 text-sm text-slate-300">{label}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {POINTS.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-2xl border border-slate-700 p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400">
                <Icon size={22} />
              </span>
              <h3 className="mt-4 text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">{text}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map(({ name, area, text }) => (
            <figure key={name} className="flex h-full flex-col rounded-2xl bg-slate-800 p-6">
              <div className="flex gap-1 text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-slate-200">
                &ldquo;{text}&rdquo;
              </blockquote>
              <figcaption className="mt-5">
                <p className="font-semibold">{name}</p>
                <p className="text-xs text-slate-400">{area}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}