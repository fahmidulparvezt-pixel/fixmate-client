import { STATUS_STYLES } from "@/lib/constants";

const LABELS = {
  requested: "Requested",
  accepted: "Accepted",
  "in-progress": "In Progress",
  completed: "Completed",
  rejected: "Rejected",
  cancelled: "Cancelled",
  unpaid: "Unpaid",
  paid: "Paid",
  pending: "Pending",
  approved: "Approved",
};

export default function StatusBadge({ status }) {
  return (
    <span
      className={`inline-block whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${
        STATUS_STYLES[status] || "bg-slate-100 text-slate-700"
      }`}
    >
      {LABELS[status] || status}
    </span>
  );
}