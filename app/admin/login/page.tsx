"use client";
// Update the import path below to the correct relative path based on your project structure.
// For example, if your AdminLogin component is at 'c:\Users\HP PC\Desktop\rsn-news\components\admin-login.tsx', use:
import AdminLogin from "../../../components/admin-login";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function AdminLoginPage() {
  const [showLogoutToast, setShowLogoutToast] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("logout") === "1") {
        setShowLogoutToast(true);
        setTimeout(() => setShowLogoutToast(false), 4000);
      }
    }
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-neutral-900">
      <div className="w-full max-w-md p-8 bg-white dark:bg-neutral-900 rounded-xl shadow-lg border border-gray-100 dark:border-neutral-800">
        <div className="flex flex-col items-center mb-6">
          <Image
            src="/RSN NEWS.jpg"
            alt="RSN News Logo"
            width={64}
            height={64}
            style={{ marginBottom: 8 }}
          />
          <h1 className="text-2xl font-bold text-center">Admin Login</h1>
        </div>
        {showLogoutToast && (
          <div className="mb-4 p-3 rounded bg-green-100 text-green-800 text-center text-sm font-medium border border-green-200">
            You have been logged out successfully.
          </div>
        )}
        <AdminLogin />
      </div>
    </div>
  );
}
