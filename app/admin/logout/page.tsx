"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const logout = async () => {
      try {
        // Call the API to clear the session cookie
        await fetch("/api/admin/logout", { method: "POST" });
        // Clear local storage
        localStorage.removeItem("adminToken");
        // Redirect to login page after logout
        router.replace("/admin-login");
      } catch (error) {
        console.error("Logout failed:", error);
        // Still redirect even if the API call fails
        router.replace("/admin-login");
      }
    };

    logout();
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-md p-8 border border-gray-100 dark:border-neutral-800 text-center">
        <h1 className="text-2xl font-bold mb-2">Logging out...</h1>
        <p className="text-gray-500">Please wait while we sign you out.</p>
      </div>
    </div>
  );
}
