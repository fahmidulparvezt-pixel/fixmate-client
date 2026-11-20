import Link from "next/link";
import { Ban } from "lucide-react";

export const metadata = { title: "Payment Cancelled | FixMate" };

export default function PaymentCancelPage() {
  return (
    <section className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <Ban size={56} className="mx-auto text-amber-500" />
        <h1 className="mt-5 text-2xl font-bold text-slate-900">Payment cancelled</h1>
        <p className="mt-2 text-sm text-slate-600">
          No money was taken and nothing changed on your booking. You can try again whenever you are
          ready.
        </p>
        <Link
          href="/dashboard/customer/bookings"
          className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-2.5 font-semibold text-white transition hover:bg-blue-700"
        >
          Try Again
        </Link>
      </div>
    </section>
  );
}