import Link from "next/link";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
import { Mail, MapPin, Phone } from "lucide-react";
import Logo from "@/components/layout/Logo";
import { CATEGORIES } from "@/lib/constants";
const QUICK_LINKS = [
  {
    href: "/",
    label: "Home",
  },
  {
    href: "/services",
    label: "Services",
  },
  {
    href: "/about",
    label: "About",
  },
];
const SOCIALS = [
  {
    href: "https://x.com",
    label: "X",
    icon: FaXTwitter,
  },
  {
    href: "https://facebook.com",
    label: "Facebook",
    icon: FaFacebookF,
  },
  {
    href: "https://linkedin.com",
    label: "LinkedIn",
    icon: FaLinkedinIn,
  },
  {
    href: "https://instagram.com",
    label: "Instagram",
    icon: FaInstagram,
  },
];
export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <Logo className="[&_span:last-child]:text-white" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">
            Verified technicians, trackable jobs and pay-after-service. Get your devices and home
            appliances fixed without the guesswork.
          </p>
          <div className="mt-5 flex gap-3">
            {SOCIALS.map(({ href, label, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-slate-300 transition hover:bg-blue-600 hover:text-white"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Quick Links</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {QUICK_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className="transition hover:text-white">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
            Popular Categories
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {CATEGORIES.slice(0, 6).map((category) => (
              <li key={category}>
                <Link
                  href={`/services?category=${encodeURIComponent(category)}`}
                  className="transition hover:text-white"
                >
                  {category}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Contact</h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <Mail size={16} className="mt-0.5 shrink-0 text-blue-400" />
              support@fixmate.com
            </li>
            <li className="flex items-start gap-3">
              <Phone size={16} className="mt-0.5 shrink-0 text-blue-400" />
              +880 1700-000000
            </li>
            <li className="flex items-start gap-3">
              <MapPin size={16} className="mt-0.5 shrink-0 text-blue-400" />
              House 12, Road 5, Dhanmondi, Dhaka 1205
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-800 py-5 text-center text-sm text-slate-500">
        &copy; {new Date().getFullYear()} FixMate. All rights reserved.
      </div>
    </footer>
  );
}
