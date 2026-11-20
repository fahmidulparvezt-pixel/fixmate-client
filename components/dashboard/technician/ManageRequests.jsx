"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Check, Inbox, Loader2, Play, Flag, X } from "lucide-react";
import ConfirmModal from "@/components/dashboard/ConfirmModal";
import StatusBadge from "@/components/dashboard/StatusBadge";
import Modal from "@/components/ui/Modal";
import { apiFetch } from "@/lib/api";
import { formatDate, formatMoney } from "@/lib/format";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "requested", label: "Requested" },
  { value: "accepted", label: "Accepted" },
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

export default function ManageRequests() {
  const [filter, setFilter] = useState("all");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [busyId, setBusyId] = useState("");

  const [rejecting, setRejecting] = useState(null);
  const [completing, setCompleting] = useState(null);
  const [amount, setAmount] = useState("");
  const [amountError, setAmountError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const query = filter === "all" ? "" : `?status=${filter}`;
        const data = await apiFetch(`/api/bookings/technician${query}`);
        if (!cancelled) setBookings(data);
      } catch (err) {
        if (!cancelled) setError(err?.message || "Could not load requests");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [filter, reloadKey]);

  const updateStatus = async (booking, status, extra = {}) => {
    setBusyId(booking._id);
    try {
      await apiFetch(`/api/bookings/${booking._id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status, ...extra }),
      });
      const messages = {
        accepted: "Request accepted",
        rejected: "Request rejected",
        "in-progress": "Work started",
        completed: "Job marked as completed",
      };
      toast.success(messages[status] || "Status updated");
      setRejecting(null);
      setCompleting(null);
      setReloadKey((k) => k + 1);
    } catch (err) {
      toast.error(err?.message || "Could not update the status");
      // Status onno jaygay change hoye thakle list refresh
      if (err?.status === 409) setReloadKey((k) => k + 1);
    } finally {
      setBusyId("");
    }
  };

  const openComplete = (booking) => {
    setCompleting(booking);
    setAmount(String(booking.finalAmount ?? booking.basePrice ?? ""));
    setAmountError("");
  };

  const submitComplete = (e) => {
    e.preventDefault();
    const value = Number(amount);
    if (amount === "" || !Number.isFinite(value) || value <= 0) {
      setAmountError("Enter an amount greater than 0");
      return;
    }
    updateStatus(completing, "completed", { finalAmount: value });
  };

  const actionButton =
    "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition disabled:opacity-60";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Manage Requests</h1>
        <p className="mt-1 text-sm text-slate-600">
          Move each job forward. Customers pay only after you mark a job completed.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
              filter === value
                ? "bg-blue-600 text-white"
                : "border border-slate-300 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="space-y-3 p-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-16 animate-pulse rounded-xl bg-slate-100" />
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
            <Inbox size={40} className="mx-auto text-slate-400" />
            <h3 className="mt-4 text-lg font-semibold text-slate-900">No requests found</h3>
            <p className="mt-1 text-sm text-slate-600">
              {filter === "all"
                ? "Repair requests for your approved services will appear here."
                : "No requests with this status right now."}
            </p>
            {filter !== "all" && (
              <button
                onClick={() => setFilter("all")}
                className="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Show All Requests
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Customer</th>
                  <th className="px-5 py-3 font-semibold">Service</th>
                  <th className="px-5 py-3 font-semibold">Address</th>
                  <th className="px-5 py-3 font-semibold">Date</th>
                  <th className="px-5 py-3 font-semibold">Problem</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.map((b) => {
                  const busy = busyId === b._id;
                  return (
                    <tr key={b._id} className="align-top">
                      <td className="px-5 py-4">
                        <p className="font-medium text-slate-900">{b.customerName}</p>
                        <p className="text-xs text-slate-500">{b.customerPhone}</p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="max-w-[180px] font-medium text-slate-900">{b.serviceTitle}</p>
                        <p className="text-xs text-slate-500">
                          {b.status === "completed"
                            ? `Final ${formatMoney(b.finalAmount)}`
                            : `Base ${formatMoney(b.basePrice)}`}
                        </p>
                      </td>
                      <td className="max-w-[200px] px-5 py-4 text-slate-600">{b.address}</td>
                      <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                        {formatDate(b.preferredDate)}
                      </td>
                      <td className="max-w-[260px] px-5 py-4 text-slate-600">
                        <p className="line-clamp-3" title={b.problemDescription}>
                          {b.problemDescription}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={b.status} />
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap justify-end gap-2">
                          {b.status === "requested" && (
                            <>
                              <button
                                onClick={() => updateStatus(b, "accepted")}
                                disabled={busy}
                                className={`${actionButton} bg-indigo-600 text-white hover:bg-indigo-700`}
                              >
                                {busy ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                                Accept
                              </button>
                              <button
                                onClick={() => setRejecting(b)}
                                disabled={busy}
                                className={`${actionButton} border border-red-200 text-red-600 hover:bg-red-50`}
                              >
                                <X size={14} /> Reject
                              </button>
                            </>
                          )}
                          {b.status === "accepted" && (
                            <button
                              onClick={() => updateStatus(b, "in-progress")}
                              disabled={busy}
                              className={`${actionButton} bg-amber-500 text-white hover:bg-amber-600`}
                            >
                              {busy ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
                              Start Work
                            </button>
                          )}
                          {b.status === "in-progress" && (
                            <button
                              onClick={() => openComplete(b)}
                              disabled={busy}
                              className={`${actionButton} bg-green-600 text-white hover:bg-green-700`}
                            >
                              <Flag size={14} /> Mark Completed
                            </button>
                          )}
                          {b.status === "completed" && <StatusBadge status={b.paymentStatus} />}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Reject confirmation */}
      <ConfirmModal
        open={Boolean(rejecting)}
        title="Reject this request?"
        message={`The request from ${rejecting?.customerName || "the customer"} will be rejected. This cannot be undone.`}
        confirmLabel="Reject Request"
        cancelLabel="Cancel"
        loading={Boolean(rejecting) && busyId === rejecting._id}
        onConfirm={() => updateStatus(rejecting, "rejected")}
        onCancel={() => setRejecting(null)}
      />

      {/* Final amount modal */}
      <Modal
        open={Boolean(completing)}
        onClose={busyId ? undefined : () => setCompleting(null)}
        title="Mark job as completed"
        maxWidth="max-w-md"
      >
        {completing && (
          <form onSubmit={submitComplete} noValidate>
            <p className="text-sm text-slate-600">
              Enter the final amount for <strong>{completing.serviceTitle}</strong>. The customer will
              be asked to pay this amount.
            </p>
            <label htmlFor="finalAmount" className="mt-5 mb-1 block text-sm font-medium text-slate-700">
              Final amount (USD)
            </label>
            <input
              id="finalAmount"
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setAmountError("");
              }}
              className={`w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition focus:ring-2 ${
                amountError
                  ? "border-red-400 focus:ring-red-200"
                  : "border-slate-300 focus:border-blue-500 focus:ring-blue-200"
              }`}
            />
            {amountError && <p className="mt-1 text-xs text-red-600">{amountError}</p>}
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setCompleting(null)}
                disabled={Boolean(busyId)}
                className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={Boolean(busyId)}
                className="flex items-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-60"
              >
                {busyId && <Loader2 size={16} className="animate-spin" />}
                Complete Job
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}