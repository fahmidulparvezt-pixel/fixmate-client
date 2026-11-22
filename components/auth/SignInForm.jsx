"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import Logo from "@/components/layout/Logo";
import GoogleButton from "@/components/auth/GoogleButton";
import { signIn, useSession } from "@/lib/auth-client";
import { DASHBOARD_HOME } from "@/lib/constants";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// shudhu nijer site er path e redirect hobe (open redirect atkate)
function getSafeRedirect(value) {
  if (value && value.startsWith("/") && !value.startsWith("//")) return value;
  return null;
}

export default function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = getSafeRedirect(searchParams.get("redirect"));
  const { data: session } = useSession();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // already logged in hole redirect page ba nijer dashboard e pathao
  useEffect(() => {
    if (session?.user) {
      router.replace(redirectTo || DASHBOARD_HOME[session.user.role] || DASHBOARD_HOME.customer);
    }
  }, [session, redirectTo, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const found = {};
    if (!form.email.trim()) found.email = "Email is required";
    else if (!EMAIL_REGEX.test(form.email)) found.email = "Enter a valid email address";
    if (!form.password) found.password = "Password is required";
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setLoading(true);
    const { data, error } = await signIn.email({
      email: form.email.trim().toLowerCase(),
      password: form.password,
    });
    setLoading(false);

    if (error) {
      toast.error(error.message || "Invalid email or password");
      return;
    }

    toast.success("Signed in successfully!");
    const role = data?.user?.role || "customer";
    router.push(redirectTo || DASHBOARD_HOME[role] || DASHBOARD_HOME.customer);
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
          <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
          <p className="mt-1 text-sm text-slate-600">Sign in to manage your repair jobs.</p>

          <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">
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
                  placeholder="Your password"
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
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-slate-200" />
            <span className="text-xs uppercase tracking-wide text-slate-500">or</span>
            <span className="h-px flex-1 bg-slate-200" />
          </div>

          <GoogleButton redirectTo={redirectTo || "/dashboard"} />

          <p className="mt-6 text-center text-sm text-slate-600">
            New to FixMate?{" "}
            <Link href="/sign-up" className="font-semibold text-blue-600 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}