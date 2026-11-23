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
import { BadgeCheck, DollarSign, Hammer, Users } from "lucide-react";
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
export default function AdminOverview() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const load = async () => {
    setLoading(true);
    setError("");
    try {
      setStats(await apiFetch("/api/admin/stats"));
    } catch (err) {
      setError(err?.message || "Could not load the overview");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);
  const chartData = Object.keys(STATUS_COLORS).map((status) => ({
    status,
    count: stats?.bookingsByStatus?.find((s) => s.status === status)?.count || 0,
  }));
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Admin Overview</h1>
        <p className="mt-1 text-sm text-slate-600">Platform activity at a glance.</p>
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
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatsCard
              icon={Users}
              label="Total Users"
              value={stats?.totalUsers}
              tone="blue"
              loading={loading}
            />
            <StatsCard
              icon={Hammer}
              label="Total Technicians"
              value={stats?.totalTechnicians}
              tone="amber"
              loading={loading}
            />
            <StatsCard
              icon={BadgeCheck}
              label="Pending Services"
              value={stats?.pendingServices}
              tone="purple"
              hint="Waiting for approval"
              loading={loading}
            />
            <StatsCard
              icon={DollarSign}
              label="Total Revenue"
              value={stats ? `$${Number(stats.totalRevenue).toFixed(2)}` : "-"}
              tone="green"
              hint={stats ? `${stats.totalBookings} bookings in total` : undefined}
              loading={loading}
            />
          </div>

          {!loading && stats?.pendingServices > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-purple-200 bg-purple-50 p-4">
              <p className="text-sm font-medium text-purple-900">
                {stats.pendingServices}{" "}
                {stats.pendingServices === 1 ? "service is" : "services are"} waiting for your
                approval.
              </p>
              <Link
                href="/dashboard/admin/services"
                className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-purple-700"
              >
                Review Now
              </Link>
            </div>
          )}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Bookings by status</h2>
            {loading ? (
              <div className="mt-4 h-64 animate-pulse rounded-xl bg-slate-100" />
            ) : stats?.totalBookings === 0 ? (
              <div className="mt-4 rounded-xl border border-dashed border-slate-300 p-8 text-center">
                <p className="font-medium text-slate-900">No bookings yet</p>
                <p className="mt-1 text-sm text-slate-600">
                  The chart will appear once customers start sending repair requests.
                </p>
              </div>
            ) : (
              <div className="mt-4 h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{
                      top: 8,
                      right: 8,
                      left: -20,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="status"
                      tick={{
                        fontSize: 12,
                      }}
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{
                        fontSize: 12,
                      }}
                    />
                    <Tooltip
                      cursor={{
                        fill: "#f1f5f9",
                      }}
                    />
                    <Bar dataKey="count" name="Bookings" radius={[6, 6, 0, 0]}>
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
