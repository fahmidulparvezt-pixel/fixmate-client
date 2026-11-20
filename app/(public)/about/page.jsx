import Link from "next/link";
import { ArrowRight, ChevronDown, Hammer, UserRound } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";

export const metadata = { title: "How It Works | FixMate" };

const CUSTOMER_STEPS = [
  "Create a free customer account.",
  "Browse approved services and filter by category, mode or price.",
  "Open a service and send a repair request with your phone, address and problem.",
  "Follow the job live from your dashboard. You can cancel while it is still requested.",
  "Pay securely online only after the technician marks the job completed.",
];

const TECHNICIAN_STEPS = [
  "Create a technician account and complete your profile.",
  "List your repair services with a photo, price, area and service mode.",
  "Wait for admin approval. Approved services go live on the public pages.",
  "Accept or reject incoming requests, then move each job forward.",
  "Set the final amount when you complete the job and get paid by the customer.",
];

const PIPELINE = [
  { label: "Requested", text: "Customer sends the request", style: "bg-blue-100 text-blue-700" },
  { label: "Accepted", text: "Technician confirms the job", style: "bg-indigo-100 text-indigo-700" },
  { label: "In Progress", text: "Repair work has started", style: "bg-amber-100 text-amber-700" },
  { label: "Completed", text: "Final amount is set", style: "bg-green-100 text-green-700" },
];

const FAQS = [
  {
    q: "Do I have to pay before the repair starts?",
    a: "No. FixMate is pay-after-service. The Pay Now button appears only after the technician marks your job as completed.",
  },
  {
    q: "Can I cancel a request?",
    a: "Yes, while the request is still in the Requested stage. Once a technician accepts it, the job moves forward and can no longer be cancelled.",
  },
  {
    q: "How are technicians verified?",
    a: "Every service listing is reviewed by an admin. Only approved services are visible to customers.",
  },
  {
    q: "Which payment methods are supported?",
    a: "Payments are processed securely by Stripe Checkout using your card.",
  },
];

function StepList({ icon: Icon, title, steps }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
          <Icon size={22} />
        </span>
        <h3 className="text-xl font-bold text-slate-900">{title}</h3>
      </div>
      <ol className="mt-6 space-y-4">
        {steps.map((step, i) => (
          <li key={step} className="flex gap-4">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
              {i + 1}
            </span>
            <p className="text-sm leading-relaxed text-slate-600">{step}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function AboutPage() {
  return (
    <>
      <section className="bg-gradient-to-b from-blue-50 to-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="How It Works"
            title="Repairs without the guesswork"
            subtitle="FixMate connects customers with verified technicians. Every job is trackable and you pay only after the work is delivered."
          />
        </div>
      </section>

      <section className="pb-16 sm:pb-20">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <StepList icon={UserRound} title="For Customers" steps={CUSTOMER_STEPS} />
          <StepList icon={Hammer} title="For Technicians" steps={TECHNICIAN_STEPS} />
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Job Tracking"
            title="Every job follows the same path"
            subtitle="You always know where your repair stands."
          />
          <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PIPELINE.map(({ label, text, style }, i) => (
              <li
                key={label}
                className="relative rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center"
              >
                <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${style}`}>
                  {label}
                </span>
                <p className="mt-3 text-sm text-slate-600">{text}</p>
                {i < PIPELINE.length - 1 && (
                  <ArrowRight
                    size={18}
                    className="absolute -right-3.5 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-white text-slate-400 lg:block"
                  />
                )}
              </li>
            ))}
          </ol>
          <p className="mt-6 text-center text-sm text-slate-500">
            A request can also be <span className="font-medium text-red-600">Rejected</span> by the
            technician or <span className="font-medium text-slate-700">Cancelled</span> by the
            customer while it is still Requested.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="FAQ" title="Common questions" />
          <div className="mt-10 space-y-3">
            {FAQS.map(({ q, a }) => (
              <details
                key={q}
                className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-slate-900 [&::-webkit-details-marker]:hidden">
                  {q}
                  <ChevronDown
                    size={18}
                    className="shrink-0 text-slate-400 transition group-open:rotate-180"
                  />
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-900 py-14 text-center text-white">
        <div className="mx-auto max-w-2xl px-4">
          <h2 className="text-3xl font-bold tracking-tight">Ready to get your device fixed?</h2>
          <p className="mt-3 text-slate-300">Join FixMate as a customer or a technician today.</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/sign-up"
              className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Create an Account
            </Link>
            <Link
              href="/services"
              className="rounded-lg border border-slate-600 px-6 py-3 font-semibold text-white transition hover:bg-slate-800"
            >
              Browse Services
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}