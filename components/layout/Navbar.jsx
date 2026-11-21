"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { LayoutDashboard, LogOut, Menu, UserCog, X } from "lucide-react";
import Logo from "@/components/layout/Logo";
import { signOut, useSession } from "@/lib/auth-client";
import { DASHBOARD_HOME } from "@/lib/constants";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "How It Works" },
];

const ROLE_BADGE = {
  customer: { label: "Customer", style: "bg-blue-100 text-blue-700" },
  technician: { label: "Technician", style: "bg-amber-100 text-amber-700" },
  admin: { label: "Admin", style: "bg-purple-100 text-purple-700" },
};

function isActive(pathname, href) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function Avatar({ user, size = "h-10 w-10" }) {
  if (user?.image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={user.image}
        alt={user.name || "User"}
        referrerPolicy="no-referrer"
        className={`${size} rounded-full border border-slate-200 object-cover`}
      />
    );
  }
  return (
    <span
      className={`${size} flex items-center justify-center rounded-full bg-blue-600 font-semibold text-white`}
    >
      {(user?.name || "U").charAt(0).toUpperCase()}
    </span>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const user = session?.user;

  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // dropdown er baire click korle bondho hobe
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSignOut = async () => {
    setDropdownOpen(false);
    setMenuOpen(false);
    const { error } = await signOut();
    if (error) {
      toast.error("Sign out failed. Please try again.");
      return;
    }
    toast.success("Signed out successfully");
    router.push("/");
    router.refresh();
  };

  const badge = ROLE_BADGE[user?.role] || ROLE_BADGE.customer;
  const dashboardHref = DASHBOARD_HOME[user?.role] || DASHBOARD_HOME.customer;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />

        {/* Desktop links */}
        <ul className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  isActive(pathname, href)
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop right side */}
        <div className="hidden items-center gap-3 md:flex">
          {isPending ? (
            <span className="h-10 w-10 animate-pulse rounded-full bg-slate-200" />
          ) : user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((o) => !o)}
                aria-label="Open user menu"
                aria-expanded={dropdownOpen}
                className="rounded-full ring-2 ring-transparent transition hover:ring-blue-200"
              >
                <Avatar user={user} />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-64 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                  <div className="border-b border-slate-100 px-3 pb-3 pt-2">
                    <p className="truncate font-semibold text-slate-900">{user.name}</p>
                    <p className="truncate text-xs text-slate-500">{user.email}</p>
                    <span
                      className={`mt-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${badge.style}`}
                    >
                      {badge.label}
                    </span>
                  </div>

                  <Link
                    href={dashboardHref}
                    onClick={() => setDropdownOpen(false)}
                    className="mt-1 flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
                  >
                    <LayoutDashboard size={16} /> Dashboard
                  </Link>
                  <Link
                    href="/dashboard/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
                  >
                    <UserCog size={16} /> Update Profile
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 md:hidden"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-slate-200 bg-white px-4 pb-5 pt-3 md:hidden">
          <ul className="space-y-1">
            {NAV_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className={`block rounded-lg px-4 py-2.5 text-sm font-medium ${
                    isActive(pathname, href)
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-4 border-t border-slate-100 pt-4">
            {user ? (
              <div className="space-y-1">
                <div className="mb-3 flex items-center gap-3 px-2">
                  <Avatar user={user} />
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-900">{user.name}</p>
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${badge.style}`}
                    >
                      {badge.label}
                    </span>
                  </div>
                </div>
                <Link
                  href={dashboardHref}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-100"
                >
                  <LayoutDashboard size={16} /> Dashboard
                </Link>
                <Link
                  href="/dashboard/profile"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-100"
                >
                  <UserCog size={16} /> Update Profile
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex w-full items-center gap-2 rounded-lg px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut size={16} /> Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/sign-in"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg border border-slate-300 px-4 py-2.5 text-center text-sm font-semibold text-slate-700"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}