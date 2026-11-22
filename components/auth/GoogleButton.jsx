"use client";

import { useState } from "react";
import { toast } from "sonner";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "@/lib/auth-client";

export default function GoogleButton({ redirectTo = "/dashboard", label = "Continue with Google" }) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const { error } = await signIn.social({
        provider: "google",
        callbackURL: redirectTo,
      });
      // success hole browser Google e redirect hoye jay, tai ekhane shudhu error handle
      if (error) {
        console.error("Google sign in error:", error);
        const detail = [error.status, error.statusText, error.message].filter(Boolean).join(" - ");
        toast.error(detail ? `Google sign in failed: ${detail}` : "Google sign in failed");
        setLoading(false);
      }
    } catch (err) {
      console.error("Google sign in exception:", err);
      toast.error(`Google sign in failed: ${err?.message || "unexpected error"}`);
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="flex w-full items-center justify-center gap-3 rounded-lg border border-slate-300 bg-white px-5 py-2.5 font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <FcGoogle size={22} />
      {loading ? "Redirecting..." : label}
    </button>
  );
}