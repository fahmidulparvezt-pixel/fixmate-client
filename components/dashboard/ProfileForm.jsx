"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Camera, Loader2 } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { authFetch } from "@/lib/api";
import { imageError, uploadImage } from "@/lib/imgbb";
import { ROLE_BADGE } from "@/lib/dashboard-menu";
const inputClass =
  "w-full rounded-lg border px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:ring-2";
const okBorder = "border-slate-300 focus:border-blue-500 focus:ring-blue-200";
const errBorder = "border-red-400 focus:border-red-500 focus:ring-red-200";
const readOnlyClass = `${inputClass} ${okBorder} cursor-not-allowed bg-slate-50 text-slate-500`;
const BIO_MAX = 300;
function validate({ name, phone, bio }) {
  const errors = {};
  if (name.trim().length < 2) errors.name = "Name must be at least 2 characters";
  if (phone.trim() && !/^[+\d][\d\s-]{6,}$/.test(phone.trim()))
    errors.phone = "Enter a valid phone number";
  if (bio.length > BIO_MAX) errors.bio = `Bio can be at most ${BIO_MAX} characters`;
  return errors;
}
export default function ProfileForm() {
  const { data: session, refetch } = useSession();
  const user = session?.user;
  const [values, setValues] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    area: user?.area || "",
    bio: user?.bio || "",
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
  const role = ["customer", "technician", "admin"].includes(user?.role) ? user.role : "customer";
  const badge = ROLE_BADGE[role];
  const photo = preview || user?.image;
  const dirty =
    Boolean(file) ||
    values.name.trim() !== (user?.name || "") ||
    values.phone.trim() !== (user?.phone || "") ||
    values.area.trim() !== (user?.area || "") ||
    values.bio.trim() !== (user?.bio || "");
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
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    setSaving(true);
    try {
      const payload = {
        name: values.name.trim(),
        phone: values.phone.trim(),
        area: values.area.trim(),
        bio: values.bio.trim(),
      };
      if (file) payload.image = await uploadImage(file);
      await authFetch("/api/users/profile", {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
      await refetch?.();
      setFile(null);
      setPreview("");
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error(err?.message || "Could not update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };
  if (!user) return null;
  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
    >
      <div className="flex items-center gap-5">
        {photo ? (
          <img
            src={photo}
            alt={user.name || "Profile photo"}
            referrerPolicy="no-referrer"
            className="h-24 w-24 rounded-full border border-slate-200 object-cover"
          />
        ) : (
          <span className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-600 text-3xl font-semibold text-white">
            {(user.name || "U").charAt(0).toUpperCase()}
          </span>
        )}
        <div>
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
            <Camera size={16} /> Change photo
            <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
          </label>
          <p className="mt-2 text-xs text-slate-500">
            JPG, PNG or WEBP, up to 5MB.{" "}
            {file && (
              <span className="font-medium text-blue-600">New photo uploads when you save.</span>
            )}
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1 block text-sm font-medium text-slate-700">
            Full name
          </label>
          <input
            id="name"
            name="name"
            value={values.name}
            onChange={handleChange}
            className={`${inputClass} ${errors.name ? errBorder : okBorder}`}
          />
          {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
        </div>

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
          <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
          <input value={user.email || ""} readOnly className={readOnlyClass} />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Role</label>
          <div className="flex h-[42px] items-center rounded-lg border border-slate-300 bg-slate-50 px-4">
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${badge.style}`}>
              {badge.label}
            </span>
          </div>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="area" className="mb-1 block text-sm font-medium text-slate-700">
            Area
          </label>
          <input
            id="area"
            name="area"
            value={values.area}
            onChange={handleChange}
            placeholder="e.g. Mirpur, Dhaka"
            className={`${inputClass} ${okBorder}`}
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="bio" className="mb-1 block text-sm font-medium text-slate-700">
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            rows={4}
            value={values.bio}
            onChange={handleChange}
            placeholder={
              role === "technician"
                ? "Your skills and experience, e.g. 5 years of smartphone and laptop repair"
                : "A short note about yourself"
            }
            className={`${inputClass} resize-none ${errors.bio ? errBorder : okBorder}`}
          />
          <div className="mt-1 flex justify-between text-xs">
            <span className="text-red-600">{errors.bio}</span>
            <span className="text-slate-400">
              {values.bio.length}/{BIO_MAX}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          type="submit"
          disabled={saving || !dirty}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving && <Loader2 size={16} className="animate-spin" />}
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
