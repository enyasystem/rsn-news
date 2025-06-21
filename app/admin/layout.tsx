import React from "react";
import AdminSidebar from "../../components/admin-sidebar";
import AdminHeader from "../../components/admin-header";

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar: responsive, collapses on small screens */}
      <div className="hidden md:block">
        <AdminSidebar className="w-64" />
      </div>
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-1 p-2 sm:p-4 md:p-6 lg:p-8 w-full max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
