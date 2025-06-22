"use client";
import AdminLogin from "@/components/admin-login";
import Image from "next/image";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-neutral-900">
      <div className="w-full max-w-md p-8 bg-white dark:bg-neutral-900 rounded-xl shadow-lg border border-gray-100 dark:border-neutral-800">
        <div className="flex flex-col items-center mb-6">
          <Image src="/placeholder-logo.png" alt="RSN News Logo" width={64} height={64} style={{ marginBottom: 8 }} />
          <h1 className="text-2xl font-bold text-center">Admin Login</h1>
        </div>
        <AdminLogin />
      </div>
    </div>
  );
}
