"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Home, LogOut, Menu, Wrench, X } from "lucide-react";
import Logo from "@/components/layout/Logo";
import { signOut, useSession } from "@/lib/auth-client";
import { DASHBOARD_HOME } from "@/lib/constants";
import { DASHBOARD_MENU, ROLE_BADGE } from "@/lib/dashboard-menu";

const ROLES = ["customer", "technician", "admin"];

function Avatar({ user }) {
  if (user?.image) {
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
    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">
      {(user?.name || "U").charAt(0).toUpperCase()}
    </span>
  );
}

function ShellLoading() {
  return (
    <div
      role="status"
      aria-label="Loading dashboard"
      className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50"
    >
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600">
        <Wrench size={28} className="animate-spin" />
      </span>
      <p className="text-sm font-medium text-slate-500">Loading your dashboard...</p>
    </div>
  );
}

export default function DashboardShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const user = session?.user;

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const signingOut = useRef(false);

  const role = ROLES.includes(user?.role) ? user.role : "customer";
  const home = DASHBOARD_HOME[role] || DASHBOARD_HOME.customer;
  const badge = ROLE_BADGE[role];
  const menu = DASHBOARD_MENU[role];

  // /dashboard/<role> er role ta ber kori. /dashboard/profile shobar jonno
  const routeRole = ROLES.find(
    (r) => pathname === `/dashboard/${r}` || pathname.startsWith(`/dashboard/${r}/`)
  );
  const forbidden = Boolean(user && routeRole && routeRole !== role);
  const isIndex = pathname === "/dashboard";

  // Route guard (session load hoya porjonto kichu kora hobe na, tai reload e logout hoy na)
  useEffect(() => {
    if (isPending || signingOut.current) return;

    if (!user) {
      router.replace(`/sign-in?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    if (forbidden) {
      toast.error("You do not have access to that page");
      router.replace(home);
      return;
    }
    if (isIndex) router.replace(home);
  }, [isPending, user, forbidden, isIndex, home, pathname, router]);

  // Page change hole mobile sidebar bondho
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const handleSignOut = async () => {
    signingOut.current = true;
    const { error } = await signOut();
    if (error) {
      signingOut.current = false;
      toast.error("Sign out failed. Please try again.");
      return;
    }
    toast.success("Signed out successfully");
    router.push("/");
    router.refresh();
  };

  if (isPending || !user || forbidden || isIndex) return <ShellLoading />;

  const isActive = ({ href, exact }) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-200 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 px-5">
          <Logo />
          <button
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {menu.map((item) => {
            const Icon = item.icon;
            const active = isActive(item);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                  active
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Icon size={18} /> {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-slate-200 p-4">
          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
          >
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur sm:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
            className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 lg:hidden"
          >
            <Menu size={22} />
          </button>
          <span className="hidden text-sm font-semibold text-slate-500 lg:block">Dashboard</span>

          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
            >
              <Home size={16} /> <span className="hidden sm:inline">Home</span>
            </Link>
            <div className="flex items-center gap-3 border-l border-slate-200 pl-3 sm:pl-4">
              <Avatar user={user} />
              <div className="hidden min-w-0 sm:block">
                <p className="max-w-40 truncate text-sm font-semibold text-slate-900">{user.name}</p>
                <span
                  className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold ${badge.style}`}
                >
                  {badge.label}
                </span>
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}