"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Eye, EyeOff, User, Wrench } from "lucide-react";
import Logo from "@/components/layout/Logo";
import GoogleButton from "@/components/auth/GoogleButton";
import { signUp, useSession } from "@/lib/auth-client";
import { DASHBOARD_HOME } from "@/lib/constants";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ROLES = [
  { value: "customer", label: "Customer", desc: "Book repairs for my devices", icon: User },
  { value: "technician", label: "Technician", desc: "Offer repair services", icon: Wrench },
];

function validate({ name, email, password }) {
  const errors = {};
  if (!name.trim()) errors.name = "Full name is required";
  if (!email.trim()) errors.email = "Email is required";
  else if (!EMAIL_REGEX.test(email)) errors.email = "Enter a valid email address";

  if (!password) errors.password = "Password is required";
  else if (password.length < 6) errors.password = "Password must be at least 6 characters";
  else if (!/[A-Z]/.test(password)) errors.password = "Password needs at least one uppercase letter";
  else if (!/[a-z]/.test(password)) errors.password = "Password needs at least one lowercase letter";

  return errors;
}

export default function SignUpForm() {
  const router = useRouter();
  const { data: session } = useSession();

  const [form, setForm] = useState({ name: "", email: "", password: "", role: "customer" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // already logged in hole nijer dashboard e pathao
  useEffect(() => {
    if (session?.user) {
      router.replace(DASHBOARD_HOME[session.user.role] || DASHBOARD_HOME.customer);
    }
  }, [session, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setLoading(true);
    const { error } = await signUp.email({
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      password: form.password,
      role: form.role,
    });
    setLoading(false);

    if (error) {
      toast.error(error.message || "Sign up failed. Please try again.");
      return;
    }

    toast.success("Account created successfully!");
    router.push(DASHBOARD_HOME[form.role]);
    router.refresh();
  };

  const inputClass = (hasError) =>
    `mt-1.5 w-full rounded-lg border px-4 py-2.5 text-slate-900 outline-none transition focus:ring-2 ${
      hasError
        ? "border-red-400 focus:ring-red-200"
        : "border-slate-300 focus:border-blue-500 focus:ring-blue-200"
    }`;

  return (
    <section className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <Logo />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h1 className="text-2xl font-bold text-slate-900">Create your account</h1>
          <p className="mt-1 text-sm text-slate-600">
            Join FixMate to book or offer device repairs.
          </p>

          <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">
            {/* Role selection */}
            <div>
              <span className="text-sm font-medium text-slate-700">I want to join as</span>
              <div className="mt-1.5 grid grid-cols-2 gap-3">
                {ROLES.map(({ value, label, desc, icon: Icon }) => {
                  const active = form.role === value;
                  return (
                    <button
                      type="button"
                      key={value}
                      onClick={() => setForm((prev) => ({ ...prev, role: value }))}
                      className={`rounded-xl border p-3 text-left transition ${
                        active
                          ? "border-blue-600 bg-blue-50 ring-2 ring-blue-200"
                          : "border-slate-300 hover:border-slate-400"
                      }`}
                    >
                      <Icon size={20} className={active ? "text-blue-600" : "text-slate-500"} />
                      <p className="mt-2 text-sm font-semibold text-slate-900">{label}</p>
                      <p className="text-xs text-slate-500">{desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label htmlFor="name" className="text-sm font-medium text-slate-700">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="Your full name"
                className={inputClass(errors.name)}
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="email" className="text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={inputClass(errors.email)}
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="text-sm font-medium text-slate-700">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min 6 chars, upper & lower case"
                  className={`${inputClass(errors.password)} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 mt-0.5 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-slate-200" />
            <span className="text-xs uppercase tracking-wide text-slate-500">or</span>
            <span className="h-px flex-1 bg-slate-200" />
          </div>

          <GoogleButton redirectTo="/dashboard" label="Sign up with Google" />
          <p className="mt-2 text-center text-xs text-slate-500">
            Google accounts join as Customer by default.
          </p>

          <p className="mt-6 text-center text-sm text-slate-600">
            Already have an account?{" "}
            <Link href="/sign-in" className="font-semibold text-blue-600 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}