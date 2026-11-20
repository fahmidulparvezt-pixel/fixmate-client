"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { formatMoney } from "@/lib/format";

export default function PaymentSuccess() {
  const sessionId = useSearchParams().get("session_id");
  const [state, setState] = useState(sessionId ? "loading" : "error");
  const [payment, setPayment] = useState(null);
  const [message, setMessage] = useState(sessionId ? "" : "Missing payment session.");
  const started = useRef(false);

  useEffect(() => {
    if (!sessionId || started.current) return;
    started.current = true;

    (async () => {
      try {
        const data = await apiFetch(`/api/payments/verify?session_id=${encodeURIComponent(sessionId)}`);
        setPayment(data);
        setState("success");
        toast.success("Payment successful!");
      } catch (err) {
        setMessage(err?.message || "We could not verify your payment.");
        setState("error");
      }
    })();
  }, [sessionId]);

  return (
    <section className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        {state === "loading" && (
          <>
            <Loader2 size={44} className="mx-auto animate-spin text-blue-600" />
            <h1 className="mt-5 text-2xl font-bold text-slate-900">Confirming your payment</h1>
            <p className="mt-2 text-sm text-slate-600">Please wait, do not close this page.</p>
          </>
        )}

        {state === "success" && payment && (
          <>
            <CheckCircle2 size={56} className="mx-auto text-green-600" />
            <h1 className="mt-5 text-2xl font-bold text-slate-900">Payment successful</h1>
            <p className="mt-2 text-sm text-slate-600">
              Thank you! Your payment for <strong>{payment.serviceTitle}</strong> is complete.
            </p>
            <dl className="mt-6 space-y-3 rounded-xl bg-slate-50 p-4 text-left text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">Amount paid</dt>
                <dd className="font-semibold text-green-700">{formatMoney(payment.amount)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="shrink-0 text-slate-500">Transaction ID</dt>
                <dd className="break-all text-right font-mono text-xs text-slate-800">
                  {payment.transactionId}
                </dd>
              </div>
            </dl>
            <Link
              href="/dashboard/customer/bookings"
              className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-2.5 font-semibold text-white transition hover:bg-blue-700"
            >
              Back to My Bookings
            </Link>
          </>
        )}

        {state === "error" && (
          <>
            <XCircle size={56} className="mx-auto text-red-500" />
            <h1 className="mt-5 text-2xl font-bold text-slate-900">Could not confirm payment</h1>
            <p className="mt-2 text-sm text-slate-600">{message}</p>
            <Link
              href="/dashboard/customer/bookings"
              className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-2.5 font-semibold text-white transition hover:bg-blue-700"
            >
              Back to My Bookings
            </Link>
          </>
        )}
      </div>
    </section>
  );
}