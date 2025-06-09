// This layout removes the public site header and provides a clean admin-only layout.
import "../globals.css";
import { ReactNode } from "react";

function AdminHeader() {
  return (
    <header className="w-full bg-zinc-900 text-white py-4 shadow">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-4">
        <span className="font-bold text-xl tracking-wide">Admin Panel</span>
      </div>
    </header>
  );
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <AdminHeader />
      <div className="min-h-screen bg-white text-black dark:bg-black dark:text-white">
        <main>{children}</main>
      </div>
    </>
  );
}
