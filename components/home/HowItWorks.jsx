import { CreditCard, Search, Send, Wrench } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";

const STEPS = [
  {
    icon: Search,
    title: "Find a Service",
    text: "Browse approved repair services and pick the technician that fits your device and area.",
  },
  {
    icon: Send,
    title: "Send a Request",
    text: "Describe the problem, add your address and preferred date, and send the request.",
  },
  {
    icon: Wrench,
    title: "Technician Fixes It",
    text: "Follow the job from accepted to in progress to completed, right from your dashboard.",
  },
  {
    icon: CreditCard,
    title: "Pay After Completion",
    text: "Pay securely online only when the job is done. No advance payment, no surprises.",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="How It Works"
          title="Fixed in four simple steps"
          subtitle="From request to payment, every stage is clear and trackable."
        />

        <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(({ icon: Icon, title, text }, index) => (
            <li
              key={title}
              className="relative rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center"
            >
              <span className="absolute -top-3 left-1/2 flex h-7 w-7 -translate-x-1/2 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                {index + 1}
              </span>
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                <Icon size={26} />
              </span>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}