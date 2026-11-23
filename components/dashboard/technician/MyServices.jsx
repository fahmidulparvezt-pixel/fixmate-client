"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { PackageOpen, Pencil, PlusCircle, Trash2 } from "lucide-react";
import ConfirmModal from "@/components/dashboard/ConfirmModal";
import StatusBadge from "@/components/dashboard/StatusBadge";
import ServiceForm from "@/components/dashboard/technician/ServiceForm";
import Modal from "@/components/ui/Modal";
import { apiFetch } from "@/lib/api";
function Toggle({ checked, disabled, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition disabled:opacity-60 ${checked ? "bg-green-500" : "bg-slate-300"}`}
    >
      <span
        className={`inline-block h-5 w-5 rounded-full bg-white shadow transition ${checked ? "translate-x-5" : "translate-x-0.5"}`}
      />
    </button>
  );
}
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
export default function MyServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [togglingId, setTogglingId] = useState("");
  const load = async () => {
    setLoading(true);
    setError("");
    try {
      setServices(await apiFetch("/api/services/my"));
    } catch (err) {
      setError(err?.message || "Could not load your services");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);
  const handleToggle = async (service) => {
    const next = !service.isAvailable;
    setTogglingId(service._id);
    setServices((list) =>
      list.map((s) =>
        s._id === service._id
          ? {
              ...s,
              isAvailable: next,
            }
          : s,
      ),
    );
    try {
      await apiFetch(`/api/services/${service._id}/availability`, {
        method: "PATCH",
        body: JSON.stringify({
          isAvailable: next,
        }),
      });
      toast.success(next ? "Service is now available" : "Service is now hidden from public pages");
    } catch (err) {
      setServices((list) =>
        list.map((s) =>
          s._id === service._id
            ? {
                ...s,
                isAvailable: !next,
              }
            : s,
        ),
      );
      toast.error(err?.message || "Could not update availability");
    } finally {
      setTogglingId("");
    }
  };
  const handleEdit = async (payload) => {
    await apiFetch(`/api/services/${editing._id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
    setServices((list) =>
      list.map((s) =>
        s._id === editing._id
          ? {
              ...s,
              ...payload,
              approvalStatus: "pending",
            }
          : s,
      ),
    );
    setEditing(null);
    toast.success("Service updated. It is waiting for admin approval again.");
  };
  const handleDelete = async () => {
    setDeleteBusy(true);
    try {
      await apiFetch(`/api/services/${deleting._id}`, {
        method: "DELETE",
      });
      setServices((list) => list.filter((s) => s._id !== deleting._id));
      toast.success("Service deleted");
      setDeleting(null);
    } catch (err) {
      toast.error(err?.message || "Could not delete service");
    } finally {
      setDeleteBusy(false);
    }
  };
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">My Services</h1>
          <p className="mt-1 text-sm text-slate-600">
            Edit, hide or remove the services you offer. Only approved and available services appear
            publicly.
          </p>
        </div>
        <Link
          href="/dashboard/technician/add-service"
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          <PlusCircle size={16} /> Add Service
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <TableSkeleton />
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
        ) : services.length === 0 ? (
          <div className="p-10 text-center">
            <PackageOpen size={40} className="mx-auto text-slate-400" />
            <h3 className="mt-4 text-lg font-semibold text-slate-900">No services yet</h3>
            <p className="mt-1 text-sm text-slate-600">
              Add your first repair service to start receiving requests.
            </p>
            <Link
              href="/dashboard/technician/add-service"
              className="mt-5 inline-block rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Add Your First Service
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Service</th>
                  <th className="px-5 py-3 font-semibold">Category</th>
                  <th className="px-5 py-3 font-semibold">Price</th>
                  <th className="px-5 py-3 font-semibold">Approval</th>
                  <th className="px-5 py-3 font-semibold">Available</th>
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
                        <span className="line-clamp-2 max-w-[240px] font-medium text-slate-900">
                          {service.title}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-slate-600">{service.category}</td>
                    <td className="px-5 py-3 font-semibold text-slate-900">${service.basePrice}</td>
                    <td className="px-5 py-3">
                      <StatusBadge status={service.approvalStatus} />
                    </td>
                    <td className="px-5 py-3">
                      <Toggle
                        checked={service.isAvailable}
                        disabled={togglingId === service._id}
                        onChange={() => handleToggle(service)}
                        label={`Toggle availability for ${service.title}`}
                      />
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setEditing(service)}
                          className="flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                          <Pencil size={14} /> Edit
                        </button>
                        <button
                          onClick={() => setDeleting(service)}
                          className="flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={Boolean(editing)} onClose={() => setEditing(null)} title="Edit service">
        {editing && (
          <>
            <p className="mb-5 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">
              After you save, this service goes back to <strong>Pending</strong> until an admin
              approves it again.
            </p>
            <ServiceForm
              key={editing._id}
              initialValues={{
                title: editing.title,
                category: editing.category,
                description: editing.description,
                basePrice: String(editing.basePrice),
                estimatedDuration: editing.estimatedDuration,
                serviceMode: editing.serviceMode,
                serviceArea: editing.serviceArea,
                image: editing.image,
              }}
              submitLabel="Save Changes"
              onSubmit={handleEdit}
            />
          </>
        )}
      </Modal>

      <ConfirmModal
        open={Boolean(deleting)}
        title="Delete this service?"
        message={`"${deleting?.title || ""}" will be removed permanently. Existing bookings for it will keep their saved details.`}
        confirmLabel="Delete Service"
        loading={deleteBusy}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
