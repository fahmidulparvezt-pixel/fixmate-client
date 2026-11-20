import { authClient } from "@/lib/auth-client";

export const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Public API (token lage na), server ar client duita jaygay kaj kore
export async function publicFetch(path) {
  const res = await fetch(`${API_URL}${path}`, { cache: "no-store" });
  if (!res.ok) {
    const err = new Error("Request failed");
    err.status = res.status;
    throw err;
  }
  return res.json();
}

// Private API: JWT token niye Authorization header e pathay (client side e chalabe)
export async function apiFetch(path, options = {}) {
  const { data } = await authClient.token();
  const token = data?.token;

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(body.message || "Something went wrong");
    err.status = res.status;
    throw err;
  }
  return body;
}