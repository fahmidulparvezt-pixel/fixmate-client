"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Receipt } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { formatDate, formatMoney } from "@/lib/format";

export default function PaymentHistory() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      setPayments(await apiFetch("/api/payments/my"));
    } catch (err) {
      setError(err?.message || "Could not load your payments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Payment History</h1>
        <p className="mt-1 text-sm text-slate-600">Every payment you have made on FixMate.</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="space-y-3 p-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-14 animate-pulse rounded-xl bg-slate-100" />
            ))}
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-700">
            <p>{error}</p>
            <button
              onClick={load}
              className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        ) : payments.length === 0 ? (
          <div className="p-10 text-center">
            <Receipt size={40} className="mx-auto text-slate-400" />
            <h3 className="mt-4 text-lg font-semibold text-slate-900">No payments yet</h3>
            <p className="mt-1 text-sm text-slate-600">
              Payments appear here after you pay for a completed job.
            </p>
            <Link
              href="/dashboard/customer/bookings"
              className="mt-5 inline-block rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Go to My Bookings
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Service</th>
                  <th className="px-5 py-3 font-semibold">Technician</th>
                  <th className="px-5 py-3 font-semibold">Amount</th>
                  <th className="px-5 py-3 font-semibold">Transaction ID</th>
                  <th className="px-5 py-3 font-semibold">Paid On</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payments.map((p) => (
                  <tr key={p._id}>
                    <td className="px-5 py-3 font-medium text-slate-900">{p.serviceTitle}</td>
                    <td className="px-5 py-3 text-slate-600">{p.technicianName}</td>
                    <td className="px-5 py-3 font-semibold text-green-700">{formatMoney(p.amount)}</td>
                    <td className="px-5 py-3 font-mono text-xs text-slate-600">{p.transactionId}</td>
                    <td className="whitespace-nowrap px-5 py-3 text-slate-600">{formatDate(p.paidAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}