"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ImagePlus, Loader2 } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { CATEGORIES, SERVICE_MODES } from "@/lib/constants";
import { imageError, uploadImage } from "@/lib/imgbb";
const inputClass =
  "w-full rounded-lg border px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:ring-2";
const okBorder = "border-slate-300 focus:border-blue-500 focus:ring-blue-200";
const errBorder = "border-red-400 focus:border-red-500 focus:ring-red-200";
const readOnlyClass = `${inputClass} ${okBorder} cursor-not-allowed bg-slate-50 text-slate-500`;
const EMPTY = {
  title: "",
  category: "",
  description: "",
  basePrice: "",
  estimatedDuration: "",
  serviceMode: "",
  serviceArea: "",
  image: "",
};
function validate(values, hasImage) {
  const errors = {};
  if (values.title.trim().length < 3) errors.title = "Title must be at least 3 characters";
  if (!CATEGORIES.includes(values.category)) errors.category = "Please choose a category";
  if (values.description.trim().length < 10)
    errors.description = "Description must be at least 10 characters";
  const price = Number(values.basePrice);
  if (values.basePrice === "" || !Number.isFinite(price) || price <= 0)
    errors.basePrice = "Enter a price greater than 0";
  if (!values.estimatedDuration.trim()) errors.estimatedDuration = "Estimated duration is required";
  if (!SERVICE_MODES.includes(values.serviceMode))
    errors.serviceMode = "Please choose a service mode";
  if (!values.serviceArea.trim()) errors.serviceArea = "Service area is required";
  if (!hasImage) errors.image = "Please upload a service image";
  return errors;
}
export default function ServiceForm({
  initialValues,
  submitLabel = "Add Service",
  onSubmit,
  resetOnSuccess = false,
}) {
  const { data: session } = useSession();
  const user = session?.user;
  const [values, setValues] = useState({
    ...EMPTY,
    ...(initialValues || {}),
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);
  const shownImage = preview || values.image;
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
  const handleFile = (e) => {
    const picked = e.target.files?.[0];
    e.target.value = "";
    if (!picked) return;
    const problem = imageError(picked);
    if (problem) {
      toast.error(problem);
      return;
    }
    setFile(picked);
    setPreview(URL.createObjectURL(picked));
    if (errors.image)
      setErrors((er) => ({
        ...er,
        image: undefined,
      }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const found = validate(values, Boolean(file || values.image));
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    setSaving(true);
    try {
      const image = file ? await uploadImage(file) : values.image;
      await onSubmit({
        title: values.title.trim(),
        category: values.category,
        description: values.description.trim(),
        basePrice: Number(values.basePrice),
        estimatedDuration: values.estimatedDuration.trim(),
        serviceMode: values.serviceMode,
        serviceArea: values.serviceArea.trim(),
        image,
      });
      if (resetOnSuccess) {
        setValues({
          ...EMPTY,
        });
        setFile(null);
        setPreview("");
      }
    } catch (err) {
      toast.error(err?.message || "Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };
  const field = (name) => `${inputClass} ${errors[name] ? errBorder : okBorder}`;
  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="title" className="mb-1 block text-sm font-medium text-slate-700">
            Service title
          </label>
          <input
            id="title"
            name="title"
            value={values.title}
            onChange={handleChange}
            placeholder="e.g. iPhone Screen Replacement"
            className={field("title")}
          />
          {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}
        </div>

        <div>
          <label htmlFor="category" className="mb-1 block text-sm font-medium text-slate-700">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={values.category}
            onChange={handleChange}
            className={field("category")}
          >
            <option value="">Select a category</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          {errors.category && <p className="mt-1 text-xs text-red-600">{errors.category}</p>}
        </div>

        <div>
          <label htmlFor="serviceMode" className="mb-1 block text-sm font-medium text-slate-700">
            Service mode
          </label>
          <select
            id="serviceMode"
            name="serviceMode"
            value={values.serviceMode}
            onChange={handleChange}
            className={field("serviceMode")}
          >
            <option value="">Select a mode</option>
            {SERVICE_MODES.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
          {errors.serviceMode && <p className="mt-1 text-xs text-red-600">{errors.serviceMode}</p>}
        </div>

        <div>
          <label htmlFor="basePrice" className="mb-1 block text-sm font-medium text-slate-700">
            Base price (USD)
          </label>
          <input
            id="basePrice"
            name="basePrice"
            type="number"
            min="0"
            step="0.01"
            value={values.basePrice}
            onChange={handleChange}
            placeholder="e.g. 45"
            className={field("basePrice")}
          />
          {errors.basePrice && <p className="mt-1 text-xs text-red-600">{errors.basePrice}</p>}
        </div>

        <div>
          <label
            htmlFor="estimatedDuration"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Estimated duration
          </label>
          <input
            id="estimatedDuration"
            name="estimatedDuration"
            value={values.estimatedDuration}
            onChange={handleChange}
            placeholder="e.g. 2-3 hours"
            className={field("estimatedDuration")}
          />
          {errors.estimatedDuration && (
            <p className="mt-1 text-xs text-red-600">{errors.estimatedDuration}</p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="serviceArea" className="mb-1 block text-sm font-medium text-slate-700">
            Service area
          </label>
          <input
            id="serviceArea"
            name="serviceArea"
            value={values.serviceArea}
            onChange={handleChange}
            placeholder="e.g. Dhanmondi, Dhaka"
            className={field("serviceArea")}
          />
          {errors.serviceArea && <p className="mt-1 text-xs text-red-600">{errors.serviceArea}</p>}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="description" className="mb-1 block text-sm font-medium text-slate-700">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            value={values.description}
            onChange={handleChange}
            placeholder="What does this service include?"
            className={`${field("description")} resize-none`}
          />
          {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Technician name</label>
          <input value={user?.name || ""} readOnly className={readOnlyClass} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Technician email</label>
          <input value={user?.email || ""} readOnly className={readOnlyClass} />
        </div>

        <div className="sm:col-span-2">
          <span className="mb-1 block text-sm font-medium text-slate-700">Service image</span>
          <div
            className={`flex flex-col items-center gap-4 rounded-xl border border-dashed p-4 sm:flex-row ${errors.image ? "border-red-400 bg-red-50/40" : "border-slate-300 bg-slate-50"}`}
          >
            {shownImage ? (
              <img
                src={shownImage}
                alt="Service preview"
                className="h-28 w-44 rounded-lg border border-slate-200 object-cover"
              />
            ) : (
              <span className="flex h-28 w-44 items-center justify-center rounded-lg bg-slate-200 text-slate-400">
                <ImagePlus size={32} />
              </span>
            )}
            <div className="text-center sm:text-left">
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                <ImagePlus size={16} /> {shownImage ? "Change image" : "Choose image"}
                <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
              </label>
              <p className="mt-2 text-xs text-slate-500">
                JPG, PNG or WEBP, up to 5MB. Uploads when you submit.
              </p>
            </div>
          </div>
          {errors.image && <p className="mt-1 text-xs text-red-600">{errors.image}</p>}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving && <Loader2 size={16} className="animate-spin" />}
          {saving ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
