"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { CATEGORIES, SERVICE_MODES } from "@/lib/constants";
const SORT_OPTIONS = [
  {
    value: "",
    label: "Newest",
  },
  {
    value: "price-asc",
    label: "Price: Low to High",
  },
  {
    value: "price-desc",
    label: "Price: High to Low",
  },
];
const selectClass =
  "w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200";
export default function ServiceFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlSearch = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const serviceMode = searchParams.get("serviceMode") || "";
  const sort = searchParams.get("sort") || "";
  const [search, setSearch] = useState(urlSearch);
  useEffect(() => {
    setSearch(urlSearch);
  }, [urlSearch]);
  const updateParams = (changes) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(changes).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, {
      scroll: false,
    });
  };
  const handleSearch = (e) => {
    e.preventDefault();
    updateParams({
      search: search.trim(),
    });
  };
  const hasFilters = urlSearch || category || serviceMode || sort;
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <form onSubmit={handleSearch} className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search
            size={18}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or category"
            aria-label="Search services"
            className="w-full rounded-lg border border-slate-300 py-2.5 pl-11 pr-4 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </div>
        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-6 py-2.5 font-semibold text-white transition hover:bg-blue-700"
        >
          Search
        </button>
      </form>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <select
          value={category}
          onChange={(e) =>
            updateParams({
              category: e.target.value,
            })
          }
          aria-label="Filter by category"
          className={selectClass}
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          value={serviceMode}
          onChange={(e) =>
            updateParams({
              serviceMode: e.target.value,
            })
          }
          aria-label="Filter by service mode"
          className={selectClass}
        >
          <option value="">All Service Modes</option>
          {SERVICE_MODES.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) =>
            updateParams({
              sort: e.target.value,
            })
          }
          aria-label="Sort services"
          className={selectClass}
        >
          {SORT_OPTIONS.map(({ value, label }) => (
            <option key={label} value={value}>
              {label}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={() =>
            router.replace(pathname, {
              scroll: false,
            })
          }
          disabled={!hasFilters}
          className="flex items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <X size={16} /> Clear Filters
        </button>
      </div>
    </div>
  );
}
