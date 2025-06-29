import React from "react";
import AdminSidebar from "@/components/admin-sidebar";
import { SidebarVisibilityProvider } from "@/components/SidebarVisibilityContext";

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarVisibilityProvider>
      <div className="min-h-screen bg-gray-100 font-sans flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-white shadow-md p-0 md:p-4 hidden md:block">
          <AdminSidebar />
        </aside>
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <main className="flex-1 w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-8 py-4 sm:py-6 md:py-10 overflow-x-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarVisibilityProvider>
  );
}
