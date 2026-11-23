"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Info, Wrench, X } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { authFetch } from "@/lib/api";
const inputClass =
  "w-full rounded-lg border px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:ring-2";
const okBorder = "border-slate-300 focus:border-blue-500 focus:ring-blue-200";
const errBorder = "border-red-400 focus:border-red-500 focus:ring-red-200";
const todayString = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().split("T")[0];
};
function validate(values) {
  const errors = {};
  if (!values.phone.trim()) errors.phone = "Phone number is required";
  else if (!/^[+\d][\d\s-]{6,}$/.test(values.phone.trim()))
    errors.phone = "Enter a valid phone number";
  if (!values.address.trim()) errors.address = "Address is required";
  if (!values.preferredDate) errors.preferredDate = "Preferred date is required";
  else if (values.preferredDate < todayString())
    errors.preferredDate = "Choose today or a future date";
  if (values.problemDescription.trim().length < 20)
    errors.problemDescription = "Describe the problem in at least 20 characters";
  return errors;
}
export default function RequestRepair({ service }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [values, setValues] = useState({
    phone: "",
    address: "",
    preferredDate: "",
    problemDescription: "",
  });
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({
      ...v,
      [name]: value,
    }));
    if (errors[name])
      setErrors((er) => ({
        ...er,
        [name]: undefined,
      }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    setSubmitting(true);
    try {
      await authFetch("/api/bookings", {
        method: "POST",
        body: JSON.stringify({
          serviceId: service._id,
          customerPhone: values.phone.trim(),
          address: values.address.trim(),
          preferredDate: values.preferredDate,
          problemDescription: values.problemDescription.trim(),
        }),
      });
      setOpen(false);
      setValues({
        phone: "",
        address: "",
        preferredDate: "",
        problemDescription: "",
      });
      toast.success("Repair request sent!", {
        description: "The technician will review it shortly.",
        action: {
          label: "My Bookings",
          onClick: () => router.push("/dashboard/customer/bookings"),
        },
      });
    } catch (err) {
      if (err?.status === 409) {
        toast.error("You already have an active request for this service");
      } else {
        toast.error(err?.message || "Could not send the request. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };
  const baseBtn =
    "flex w-full items-center justify-center gap-2 rounded-lg px-5 py-3 font-semibold transition";
  if (isPending) {
    return <div className="h-12 w-full animate-pulse rounded-lg bg-slate-200" />;
  }
  if (!user) {
    return (
      <Link
        href={`/sign-in?redirect=${encodeURIComponent(pathname)}`}
        className={`${baseBtn} bg-blue-600 text-white hover:bg-blue-700`}
      >
        <Wrench size={18} /> Request Repair
      </Link>
    );
  }
  if (user.role !== "customer") {
    return (
      <div>
        <button disabled className={`${baseBtn} cursor-not-allowed bg-slate-200 text-slate-500`}>
          <Wrench size={18} /> Request Repair
        </button>
        <p className="mt-3 flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
          <Info size={14} className="mt-0.5 shrink-0" />
          Only customers can request a repair.
        </p>
      </div>
    );
  }
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`${baseBtn} bg-blue-600 text-white hover:bg-blue-700`}
      >
        <Wrench size={18} /> Request Repair
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-slate-900/60 p-0 sm:items-center sm:p-4"
          onMouseDown={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Request repair"
            className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-white p-6 shadow-xl sm:rounded-2xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Request a repair</h2>
                <p className="mt-1 text-sm text-slate-500">{service.title}</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Name</label>
                  <input
                    value={user.name || ""}
                    readOnly
                    className={`${inputClass} ${okBorder} cursor-not-allowed bg-slate-50 text-slate-500`}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
                  <input
                    value={user.email || ""}
                    readOnly
                    className={`${inputClass} ${okBorder} cursor-not-allowed bg-slate-50 text-slate-500`}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="phone" className="mb-1 block text-sm font-medium text-slate-700">
                    Phone
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={values.phone}
                    onChange={handleChange}
                    placeholder="+880 1XXX-XXXXXX"
                    className={`${inputClass} ${errors.phone ? errBorder : okBorder}`}
                  />
                  {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
                </div>
                <div>
                  <label
                    htmlFor="preferredDate"
                    className="mb-1 block text-sm font-medium text-slate-700"
                  >
                    Preferred date
                  </label>
                  <input
                    id="preferredDate"
                    name="preferredDate"
                    type="date"
                    min={todayString()}
                    value={values.preferredDate}
                    onChange={handleChange}
                    className={`${inputClass} ${errors.preferredDate ? errBorder : okBorder}`}
                  />
                  {errors.preferredDate && (
                    <p className="mt-1 text-xs text-red-600">{errors.preferredDate}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="address" className="mb-1 block text-sm font-medium text-slate-700">
                  Address
                </label>
                <input
                  id="address"
                  name="address"
                  value={values.address}
                  onChange={handleChange}
                  placeholder="House, road, area, city"
                  className={`${inputClass} ${errors.address ? errBorder : okBorder}`}
                />
                {errors.address && <p className="mt-1 text-xs text-red-600">{errors.address}</p>}
              </div>

              <div>
                <label
                  htmlFor="problemDescription"
                  className="mb-1 block text-sm font-medium text-slate-700"
                >
                  Problem description
                </label>
                <textarea
                  id="problemDescription"
                  name="problemDescription"
                  rows={4}
                  value={values.problemDescription}
                  onChange={handleChange}
                  placeholder="What is wrong with the device? (min 20 characters)"
                  className={`${inputClass} resize-none ${errors.problemDescription ? errBorder : okBorder}`}
                />
                <div className="mt-1 flex justify-between text-xs">
                  <span className="text-red-600">{errors.problemDescription}</span>
                  <span className="text-slate-400">
                    {values.problemDescription.trim().length}/20+
                  </span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
                >
                  {submitting ? "Sending..." : "Send Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
