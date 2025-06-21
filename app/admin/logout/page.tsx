"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogoutPage() {
  const router = useRouter();

  useEffect(() => {
    // Clear any admin session/auth tokens here
    // For example, localStorage.removeItem('adminToken');
    // Optionally, call your API to invalidate the session
    localStorage.removeItem("adminToken");
    // Redirect to login page after logout
    router.replace("/admin");
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-md p-8 border border-gray-100 dark:border-neutral-800 text-center">
        <h1 className="text-2xl font-bold mb-2">Logging out...</h1>
        <p className="text-gray-500">You are being signed out. Redirecting to admin login.</p>
      </div>
    </div>
  );
}
