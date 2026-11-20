"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CheckCircle2, ClipboardList, Hammer, Search } from "lucide-react";
import StatsCard from "@/components/dashboard/StatsCard";
import { apiFetch } from "@/lib/api";

const STATUS_COLORS = {
  requested: "#3b82f6",
  accepted: "#6366f1",
  "in-progress": "#f59e0b",
  completed: "#22c55e",
  rejected: "#ef4444",
  cancelled: "#9ca3af",
};

const ACTIVE = ["requested", "accepted", "in-progress"];

export default function CustomerOverview() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      setBookings(await apiFetch("/api/bookings/my"));
    } catch (err) {
      setError(err?.message || "Could not load your overview");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const active = bookings.filter((b) => ACTIVE.includes(b.status)).length;
  const completed = bookings.filter((b) => b.status === "completed").length;
  const toPay = bookings.filter((b) => b.status === "completed" && b.paymentStatus === "unpaid").length;

  const chartData = Object.keys(STATUS_COLORS).map((status) => ({
    status,
    count: bookings.filter((b) => b.status === status).length,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">My Overview</h1>
          <p className="mt-1 text-sm text-slate-600">Your repair requests at a glance.</p>
        </div>
        <Link
          href="/services"
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          <Search size={16} /> Browse Services
        </Link>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-700">
          <p>{error}</p>
          <button
            onClick={load}
            className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <StatsCard
              icon={ClipboardList}
              label="Total Requests"
              value={bookings.length}
              tone="blue"
              loading={loading}
            />
            <StatsCard
              icon={Hammer}
              label="Active Jobs"
              value={active}
              tone="amber"
              loading={loading}
            />
            <StatsCard
              icon={CheckCircle2}
              label="Completed Jobs"
              value={completed}
              tone="green"
              loading={loading}
            />
          </div>

          {!loading && toPay > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-green-200 bg-green-50 p-4">
              <p className="text-sm font-medium text-green-900">
                {toPay} completed {toPay === 1 ? "job is" : "jobs are"} ready for payment.
              </p>
              <Link
                href="/dashboard/customer/bookings"
                className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700"
              >
                Go to My Bookings
              </Link>
            </div>
          )}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Requests by status</h2>
            {loading ? (
              <div className="mt-4 h-64 animate-pulse rounded-xl bg-slate-100" />
            ) : bookings.length === 0 ? (
              <div className="mt-4 rounded-xl border border-dashed border-slate-300 p-8 text-center">
                <p className="font-medium text-slate-900">No repair requests yet</p>
                <p className="mt-1 text-sm text-slate-600">
                  Find a service and send your first repair request.
                </p>
                <Link
                  href="/services"
                  className="mt-4 inline-block rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Browse Services
                </Link>
              </div>
            ) : (
              <div className="mt-4 h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="status" tick={{ fontSize: 12 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                    <Tooltip cursor={{ fill: "#f1f5f9" }} />
                    <Bar dataKey="count" name="Requests" radius={[6, 6, 0, 0]}>
                      {chartData.map((entry) => (
                        <Cell key={entry.status} fill={STATUS_COLORS[entry.status]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}