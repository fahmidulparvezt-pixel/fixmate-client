"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Check, ClipboardCheck, X } from "lucide-react";
import ConfirmModal from "@/components/dashboard/ConfirmModal";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { apiFetch } from "@/lib/api";
const FILTERS = [
  {
    value: "pending",
    label: "Pending",
  },
  {
    value: "approved",
    label: "Approved",
  },
  {
    value: "rejected",
    label: "Rejected",
  },
  {
    value: "all",
    label: "All",
  },
];
function TableSkeleton() {
  return (
    <div className="space-y-3 p-5">
      {Array.from({
        length: 4,
      }).map((_, i) => (
        <div key={i} className="h-16 animate-pulse rounded-xl bg-slate-100" />
      ))}
    </div>
  );
}
export default function ServiceApproval() {
  const [filter, setFilter] = useState("pending");
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");
  const [rejecting, setRejecting] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const query = filter === "all" ? "" : `?status=${filter}`;
        const data = await apiFetch(`/api/admin/services${query}`);
        if (!cancelled) setServices(data);
      } catch (err) {
        if (!cancelled) setError(err?.message || "Could not load services");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [filter, reloadKey]);
  const decide = async (service, approvalStatus) => {
    setBusyId(service._id);
    try {
      await apiFetch(`/api/admin/services/${service._id}/approval`, {
        method: "PATCH",
        body: JSON.stringify({
          approvalStatus,
        }),
      });
      toast.success(approvalStatus === "approved" ? "Service approved" : "Service rejected");
      setServices((list) =>
        filter === "all"
          ? list.map((s) =>
              s._id === service._id
                ? {
                    ...s,
                    approvalStatus,
                  }
                : s,
            )
          : list.filter((s) => s._id !== service._id),
      );
      setRejecting(null);
    } catch (err) {
      toast.error(err?.message || "Could not update the service");
    } finally {
      setBusyId("");
    }
  };
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Service Approval</h1>
        <p className="mt-1 text-sm text-slate-600">
          Only approved and available services are visible to customers.
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
          <TableSkeleton />
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
        ) : services.length === 0 ? (
          <div className="p-10 text-center">
            <ClipboardCheck size={40} className="mx-auto text-slate-400" />
            <h3 className="mt-4 text-lg font-semibold text-slate-900">
              {filter === "pending" ? "Nothing waiting for approval" : "No services found"}
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              {filter === "pending"
                ? "New technician services will show up here for review."
                : "Try a different filter."}
            </p>
            {filter !== "all" && (
              <button
                onClick={() => setFilter("all")}
                className="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Show All Services
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Service</th>
                  <th className="px-5 py-3 font-semibold">Technician</th>
                  <th className="px-5 py-3 font-semibold">Category</th>
                  <th className="px-5 py-3 font-semibold">Price</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {services.map((service) => (
                  <tr key={service._id} className="align-middle">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={service.image}
                          alt={service.title}
                          className="h-12 w-16 shrink-0 rounded-lg border border-slate-200 object-cover"
                        />
                        <span className="line-clamp-2 max-w-[220px] font-medium text-slate-900">
                          {service.title}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <p className="font-medium text-slate-900">{service.technicianName}</p>
                      <p className="text-xs text-slate-500">{service.technicianEmail}</p>
                    </td>
                    <td className="px-5 py-3 text-slate-600">{service.category}</td>
                    <td className="px-5 py-3 font-semibold text-slate-900">${service.basePrice}</td>
                    <td className="px-5 py-3">
                      <StatusBadge status={service.approvalStatus} />
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-2">
                        {service.approvalStatus !== "approved" && (
                          <button
                            onClick={() => decide(service, "approved")}
                            disabled={busyId === service._id}
                            className="flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-green-700 disabled:opacity-60"
                          >
                            <Check size={14} /> Approve
                          </button>
                        )}
                        {service.approvalStatus !== "rejected" && (
                          <button
                            onClick={() => setRejecting(service)}
                            disabled={busyId === service._id}
                            className="flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-60"
                          >
                            <X size={14} /> Reject
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmModal
        open={Boolean(rejecting)}
        title="Reject this service?"
        message={`"${rejecting?.title || ""}" will be hidden from customers. The technician can edit it and send it for approval again.`}
        confirmLabel="Reject Service"
        cancelLabel="Cancel"
        loading={Boolean(rejecting) && busyId === rejecting._id}
        onConfirm={() => decide(rejecting, "rejected")}
        onCancel={() => setRejecting(null)}
      />
    </div>
  );
}
