"use client";

import { useEffect, useState } from "react";
import { ClipboardList } from "lucide-react";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { apiFetch } from "@/lib/api";
import { formatDate, formatMoney } from "@/lib/format";
const FILTERS = [
  {
    value: "all",
    label: "All",
  },
  {
    value: "requested",
    label: "Requested",
  },
  {
    value: "accepted",
    label: "Accepted",
  },
  {
    value: "in-progress",
    label: "In Progress",
  },
  {
    value: "completed",
    label: "Completed",
  },
  {
    value: "rejected",
    label: "Rejected",
  },
  {
    value: "cancelled",
    label: "Cancelled",
  },
];
export default function AllBookings() {
  const [filter, setFilter] = useState("all");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const query = filter === "all" ? "" : `?status=${filter}`;
        const data = await apiFetch(`/api/admin/bookings${query}`);
        if (!cancelled) setBookings(data);
      } catch (err) {
        if (!cancelled) setError(err?.message || "Could not load bookings");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [filter, reloadKey]);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">All Bookings</h1>
        <p className="mt-1 text-sm text-slate-600">
          Every repair job on the platform. This view is read-only.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${filter === value ? "bg-blue-600 text-white" : "border border-slate-300 bg-white text-slate-600 hover:bg-slate-50"}`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="space-y-3 p-5">
            {Array.from({
              length: 5,
            }).map((_, i) => (
              <div key={i} className="h-14 animate-pulse rounded-xl bg-slate-100" />
            ))}
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-700">
            <p>{error}</p>
            <button
              onClick={() => setReloadKey((k) => k + 1)}
              className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        ) : bookings.length === 0 ? (
          <div className="p-10 text-center">
            <ClipboardList size={40} className="mx-auto text-slate-400" />
            <h3 className="mt-4 text-lg font-semibold text-slate-900">No bookings found</h3>
            <p className="mt-1 text-sm text-slate-600">
              {filter === "all"
                ? "Bookings will appear here once customers send repair requests."
                : "No bookings with this status."}
            </p>
            {filter !== "all" && (
              <button
                onClick={() => setFilter("all")}
                className="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Show All Bookings
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Service</th>
                  <th className="px-5 py-3 font-semibold">Customer</th>
                  <th className="px-5 py-3 font-semibold">Technician</th>
                  <th className="px-5 py-3 font-semibold">Date</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold">Payment</th>
                  <th className="px-5 py-3 text-right font-semibold">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.map((b) => (
                  <tr key={b._id} className="align-middle">
                    <td className="px-5 py-3">
                      <p className="max-w-[220px] font-medium text-slate-900">{b.serviceTitle}</p>
                      <p className="text-xs text-slate-500">{b.category}</p>
                    </td>
                    <td className="px-5 py-3">
                      <p className="font-medium text-slate-900">{b.customerName}</p>
                      <p className="text-xs text-slate-500">{b.customerEmail}</p>
                    </td>
                    <td className="px-5 py-3">
                      <p className="font-medium text-slate-900">{b.technicianName}</p>
                      <p className="text-xs text-slate-500">{b.technicianEmail}</p>
                    </td>
                    <td className="whitespace-nowrap px-5 py-3 text-slate-600">
                      {formatDate(b.preferredDate)}
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge status={b.status} />
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge status={b.paymentStatus} />
                    </td>
                    <td className="px-5 py-3 text-right font-semibold text-slate-900">
                      {formatMoney(b.status === "completed" ? b.finalAmount : b.basePrice)}
                    </td>
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
