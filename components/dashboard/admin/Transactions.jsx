"use client";

import { useEffect, useState } from "react";
import { DollarSign, Receipt } from "lucide-react";
import StatsCard from "@/components/dashboard/StatsCard";
import { apiFetch } from "@/lib/api";
import { formatDate, formatMoney } from "@/lib/format";

export default function Transactions() {
  const [data, setData] = useState({ totalRevenue: 0, payments: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      setData(await apiFetch("/api/admin/payments"));
    } catch (err) {
      setError(err?.message || "Could not load transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const { totalRevenue, payments } = data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Transactions</h1>
        <p className="mt-1 text-sm text-slate-600">Every Stripe payment received on the platform.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatsCard
          icon={DollarSign}
          label="Total Revenue"
          value={formatMoney(totalRevenue)}
          tone="green"
          loading={loading}
        />
        <StatsCard
          icon={Receipt}
          label="Transactions"
          value={payments.length}
          tone="blue"
          loading={loading}
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="space-y-3 p-5">
            {Array.from({ length: 5 }).map((_, i) => (
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
            <h3 className="mt-4 text-lg font-semibold text-slate-900">No transactions yet</h3>
            <p className="mt-1 text-sm text-slate-600">
              Payments show up here after customers pay for completed jobs.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Customer</th>
                  <th className="px-5 py-3 font-semibold">Technician</th>
                  <th className="px-5 py-3 font-semibold">Service</th>
                  <th className="px-5 py-3 font-semibold">Amount</th>
                  <th className="px-5 py-3 font-semibold">Transaction ID</th>
                  <th className="px-5 py-3 font-semibold">Paid On</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payments.map((p) => (
                  <tr key={p._id} className="align-middle">
                    <td className="px-5 py-3">
                      <p className="font-medium text-slate-900">{p.customerName}</p>
                      <p className="text-xs text-slate-500">{p.customerEmail}</p>
                    </td>
                    <td className="px-5 py-3 text-slate-600">{p.technicianName}</td>
                    <td className="px-5 py-3 text-slate-900">{p.serviceTitle}</td>
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