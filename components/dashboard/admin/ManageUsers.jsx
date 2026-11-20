"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Users } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";

const ROLES = ["customer", "technician", "admin"];

function formatDate(value) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function Avatar({ user }) {
  if (user.image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={user.image}
        alt={user.name || "User"}
        referrerPolicy="no-referrer"
        className="h-10 w-10 rounded-full border border-slate-200 object-cover"
      />
    );
  }
  return (
    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
      {(user.name || "U").charAt(0).toUpperCase()}
    </span>
  );
}

export default function ManageUsers() {
  const { data: session } = useSession();
  const myId = session?.user?.id;

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      setUsers(await apiFetch("/api/admin/users"));
    } catch (err) {
      setError(err?.message || "Could not load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const changeRole = async (user, role) => {
    if (role === user.role) return;
    setBusyId(user._id);
    try {
      await apiFetch(`/api/admin/users/${user._id}/role`, {
        method: "PATCH",
        body: JSON.stringify({ role }),
      });
      setUsers((list) => list.map((u) => (u._id === user._id ? { ...u, role } : u)));
      toast.success(`${user.name} is now a ${role}`);
    } catch (err) {
      toast.error(err?.message || "Could not change the role");
    } finally {
      setBusyId("");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Manage Users</h1>
        <p className="mt-1 text-sm text-slate-600">
          Change a user&apos;s role. You cannot change your own role.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="space-y-3 p-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-14 animate-pulse rounded-xl bg-slate-100" />
            ))}
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-700">
            <p>{error}</p>
            <button
              onClick={load}
              className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        ) : users.length === 0 ? (
          <div className="p-10 text-center">
            <Users size={40} className="mx-auto text-slate-400" />
            <h3 className="mt-4 text-lg font-semibold text-slate-900">No users yet</h3>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">User</th>
                  <th className="px-5 py-3 font-semibold">Email</th>
                  <th className="px-5 py-3 font-semibold">Role</th>
                  <th className="px-5 py-3 font-semibold">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((user) => {
                  const isMe = user._id === myId;
                  return (
                    <tr key={user._id} className="align-middle">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar user={user} />
                          <span className="font-medium text-slate-900">
                            {user.name}
                            {isMe && (
                              <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-500">
                                You
                              </span>
                            )}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-slate-600">{user.email}</td>
                      <td className="px-5 py-3">
                        <select
                          value={user.role || "customer"}
                          onChange={(e) => changeRole(user, e.target.value)}
                          disabled={isMe || busyId === user._id}
                          aria-label={`Role for ${user.name}`}
                          className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500"
                        >
                          {ROLES.map((r) => (
                            <option key={r} value={r}>
                              {r.charAt(0).toUpperCase() + r.slice(1)}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-5 py-3 text-slate-600">{formatDate(user.createdAt)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}