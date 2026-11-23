import "./globals.css";
import { Toaster } from "sonner";
export const metadata = {
  title: "FixMate | Device & Home Appliance Repair",
  description:
    "Book verified technicians for smartphone, laptop, AC, fridge, TV and more. Track every job and pay only after the work is done.",
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        {children}
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
