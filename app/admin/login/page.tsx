"use client";
import AdminLogin from "@/components/admin-login";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-neutral-900">
      <div className="w-full max-w-md p-8 bg-white dark:bg-neutral-900 rounded-xl shadow-lg border border-gray-100 dark:border-neutral-800">
        <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>
        <AdminLogin />
      </div>
    </div>
  );
}
