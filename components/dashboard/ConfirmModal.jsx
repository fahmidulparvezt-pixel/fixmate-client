"use client";

import { Loader2, TriangleAlert } from "lucide-react";
import Modal from "@/components/ui/Modal";
export default function ConfirmModal({
  open,
  title = "Are you sure?",
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Keep it",
  loading = false,
  onConfirm,
  onCancel,
}) {
  return (
    <Modal open={open} onClose={loading ? undefined : onCancel} title={title} maxWidth="max-w-md">
      <div className="flex gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
          <TriangleAlert size={22} />
        </span>
        <p className="text-sm leading-relaxed text-slate-600">{message}</p>
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <button
          onClick={onCancel}
          disabled={loading}
          className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
        >
          {cancelLabel}
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className="flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
