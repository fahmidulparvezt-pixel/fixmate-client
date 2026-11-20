"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { ClipboardList, CreditCard, Loader2 } from "lucide-react";
import ConfirmModal from "@/components/dashboard/ConfirmModal";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { apiFetch } from "@/lib/api";
import { formatDate, formatMoney } from "@/lib/format";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [cancelling, setCancelling] = useState(null);
  const [cancelBusy, setCancelBusy] = useState(false);
  const [payingId, setPayingId] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      setBookings(await apiFetch("/api/bookings/my"));
    } catch (err) {
      setError(err?.message || "Could not load your bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCancel = async () => {
    setCancelBusy(true);
    try {
      await apiFetch(`/api/bookings/${cancelling._id}/cancel`, { method: "PATCH" });
      setBookings((list) =>
        list.map((b) => (b._id === cancelling._id ? { ...b, status: "cancelled" } : b))
      );
      toast.success("Booking cancelled");
      setCancelling(null);
    } catch (err) {
      toast.error(err?.message || "Could not cancel the booking");
      setCancelling(null);
      load();
    } finally {
      setCancelBusy(false);
    }
  };

  const handlePay = async (booking) => {
    setPayingId(booking._id);
    try {
      const { url } = await apiFetch("/api/payments/create-checkout-session", {
        method: "POST",
        body: JSON.stringify({ bookingId: booking._id }),
      });
      if (!url) throw new Error("Could not start the payment");
      window.location.href = url;
    } catch (err) {
      toast.error(err?.message || "Could not start the payment");
      setPayingId("");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">My Bookings</h1>
        <p className="mt-1 text-sm text-slate-600">
          Track your repair requests. You can cancel while a request is still Requested, and pay once
          it is Completed.
        </p>
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
              onClick={load}
              className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        ) : bookings.length === 0 ? (
          <div className="p-10 text-center">
            <ClipboardList size={40} className="mx-auto text-slate-400" />
            <h3 className="mt-4 text-lg font-semibold text-slate-900">No bookings yet</h3>
            <p className="mt-1 text-sm text-slate-600">
              Find a technician and send your first repair request.
            </p>
            <Link
              href="/services"
              className="mt-5 inline-block rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Browse Services
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Service</th>
                  <th className="px-5 py-3 font-semibold">Technician</th>
                  <th className="px-5 py-3 font-semibold">Preferred Date</th>
                  <th className="px-5 py-3 font-semibold">Price</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold">Payment</th>
                  <th className="px-5 py-3 text-right font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.map((b) => {
                  const canPay = b.status === "completed" && b.paymentStatus === "unpaid";
                  return (
                    <tr key={b._id} className="align-middle">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={b.serviceImage}
                            alt={b.serviceTitle}
                            className="h-12 w-16 shrink-0 rounded-lg border border-slate-200 object-cover"
                          />
                          <span className="line-clamp-2 max-w-[200px] font-medium text-slate-900">
                            {b.serviceTitle}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-slate-600">{b.technicianName}</td>
                      <td className="whitespace-nowrap px-5 py-3 text-slate-600">
                        {formatDate(b.preferredDate)}
                      </td>
                      <td className="px-5 py-3">
                        <p className="font-semibold text-slate-900">
                          {b.status === "completed" ? formatMoney(b.finalAmount) : formatMoney(b.basePrice)}
                        </p>
                        <p className="text-xs text-slate-500">
                          {b.status === "completed" ? "Final amount" : "Base price"}
                        </p>
                      </td>
                      <td className="px-5 py-3">
                        <StatusBadge status={b.status} />
                      </td>
                      <td className="px-5 py-3">
                        <StatusBadge status={b.paymentStatus} />
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex justify-end">
                          {b.status === "requested" && (
                            <button
                              onClick={() => setCancelling(b)}
                              className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                            >
                              Cancel
                            </button>
                          )}
                          {canPay && (
                            <button
                              onClick={() => handlePay(b)}
                              disabled={payingId === b._id}
                              className="flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-green-700 disabled:opacity-60"
                            >
                              {payingId === b._id ? (
                                <Loader2 size={14} className="animate-spin" />
                              ) : (
                                <CreditCard size={14} />
                              )}
                              Pay Now
                            </button>
                          )}
                          {b.paymentStatus === "paid" && <StatusBadge status="paid" />}
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

      <ConfirmModal
        open={Boolean(cancelling)}
        title="Cancel this request?"
        message={`Your request for "${cancelling?.serviceTitle || ""}" will be cancelled. You can send a new request later.`}
        confirmLabel="Cancel Request"
        cancelLabel="Keep Request"
        loading={cancelBusy}
        onConfirm={handleCancel}
        onCancel={() => setCancelling(null)}
      />
    </div>
  );
}