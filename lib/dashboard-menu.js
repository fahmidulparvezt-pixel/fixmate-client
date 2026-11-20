import {
  BadgeCheck,
  ClipboardList,
  CreditCard,
  Inbox,
  LayoutDashboard,
  PlusCircle,
  Receipt,
  UserCog,
  Users,
  Wrench,
} from "lucide-react";

export const ROLE_BADGE = {
  customer: { label: "Customer", style: "bg-blue-100 text-blue-700" },
  technician: { label: "Technician", style: "bg-amber-100 text-amber-700" },
  admin: { label: "Admin", style: "bg-purple-100 text-purple-700" },
};

const PROFILE = { href: "/dashboard/profile", label: "Update Profile", icon: UserCog };

export const DASHBOARD_MENU = {
  customer: [
    { href: "/dashboard/customer", label: "Overview", icon: LayoutDashboard, exact: true },
    { href: "/dashboard/customer/bookings", label: "My Bookings", icon: ClipboardList },
    { href: "/dashboard/customer/payments", label: "Payment History", icon: CreditCard },
    PROFILE,
  ],
  technician: [
    { href: "/dashboard/technician", label: "Overview", icon: LayoutDashboard, exact: true },
    { href: "/dashboard/technician/add-service", label: "Add Service", icon: PlusCircle },
    { href: "/dashboard/technician/my-services", label: "My Services", icon: Wrench },
    { href: "/dashboard/technician/requests", label: "Manage Requests", icon: Inbox },
    PROFILE,
  ],
  admin: [
    { href: "/dashboard/admin", label: "Overview", icon: LayoutDashboard, exact: true },
    { href: "/dashboard/admin/users", label: "Manage Users", icon: Users },
    { href: "/dashboard/admin/services", label: "Service Approval", icon: BadgeCheck },
    { href: "/dashboard/admin/bookings", label: "All Bookings", icon: ClipboardList },
    { href: "/dashboard/admin/transactions", label: "Transactions", icon: Receipt },
    PROFILE,
  ],
};