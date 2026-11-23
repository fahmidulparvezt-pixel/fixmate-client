"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import ServiceForm from "@/components/dashboard/technician/ServiceForm";
import { apiFetch } from "@/lib/api";
export default function AddServicePage() {
  const router = useRouter();
  const handleSubmit = async (payload) => {
    await apiFetch("/api/services", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    toast.success("Service submitted! It is waiting for admin approval.", {
      action: {
        label: "My Services",
        onClick: () => router.push("/dashboard/technician/my-services"),
      },
    });
  };
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">Add a Service</h1>
      <p className="mt-1 mb-6 text-sm text-slate-600">
        New services stay pending until an admin approves them.
      </p>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <ServiceForm submitLabel="Add Service" onSubmit={handleSubmit} resetOnSuccess />
      </div>
    </div>
  );
}
