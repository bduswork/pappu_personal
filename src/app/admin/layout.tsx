import type { Metadata } from "next";
import Link from "next/link";
import AdminSidebar from "@/components/admin/AdminSidebar";

export const metadata: Metadata = {
  title: "Admin · ABM Whaiduzzaman",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar />

      {/* Mobile top bar (full sidebar is desktop-only for now) */}
      <div className="flex items-center justify-between border-b border-line bg-white px-5 py-3 lg:hidden">
        <span className="text-sm font-bold tracking-tight text-ink">Admin Panel</span>
        <Link href="/" className="text-xs font-medium text-brand-green">
          View site
        </Link>
      </div>

      <div className="lg:pl-64">
        <div className="mx-auto max-w-6xl px-5 py-8 lg:px-10">{children}</div>
      </div>
    </div>
  );
}
