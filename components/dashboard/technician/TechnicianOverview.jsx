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
import { BadgeCheck, Inbox, PlusCircle, Wrench } from "lucide-react";
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

export default function TechnicianOverview() {
  const [data, setData] = useState({ services: [], bookings: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [services, bookings] = await Promise.all([
        apiFetch("/api/services/my"),
        apiFetch("/api/bookings/technician"),
      ]);
      setData({ services, bookings });
    } catch (err) {
      setError(err?.message || "Could not load your overview");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const { services, bookings } = data;
  const approved = services.filter((s) => s.approvalStatus === "approved").length;
  const pendingRequests = bookings.filter((b) => b.status === "requested").length;

  const chartData = Object.keys(STATUS_COLORS).map((status) => ({
    status,
    count: bookings.filter((b) => b.status === status).length,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Technician Overview</h1>
          <p className="mt-1 text-sm text-slate-600">Your services and repair requests at a glance.</p>
        </div>
        <Link
          href="/dashboard/technician/add-service"
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          <PlusCircle size={16} /> Add Service
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
              icon={Wrench}
              label="Total Services"
              value={services.length}
              tone="blue"
              loading={loading}
            />
            <StatsCard
              icon={BadgeCheck}
              label="Approved Services"
              value={approved}
              tone="green"
              loading={loading}
            />
            <StatsCard
              icon={Inbox}
              label="Pending Requests"
              value={pendingRequests}
              tone="amber"
              hint="Waiting for your response"
              loading={loading}
            />
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Jobs by status</h2>
            {loading ? (
              <div className="mt-4 h-64 animate-pulse rounded-xl bg-slate-100" />
            ) : bookings.length === 0 ? (
              <div className="mt-4 rounded-xl border border-dashed border-slate-300 p-8 text-center">
                <p className="font-medium text-slate-900">No repair requests yet</p>
                <p className="mt-1 text-sm text-slate-600">
                  Once customers book your approved services, the job chart will show up here.
                </p>
              </div>
            ) : (
              <div className="mt-4 h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="status" tick={{ fontSize: 12 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                    <Tooltip cursor={{ fill: "#f1f5f9" }} />
                    <Bar dataKey="count" name="Jobs" radius={[6, 6, 0, 0]}>
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